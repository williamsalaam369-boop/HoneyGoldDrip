from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import stripe
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ---- HoneyGold Drip shop / Stripe payments ----
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

SHIRT_SIZE_PRICES = {
    "S": 48.0, "M": 50.0, "L": 52.0, "XL": 54.0,
    "2XL": 56.0, "3XL": 58.0, "4XL": 60.0,
}
JEAN_SIZE_PRICES = {
    "S": 80.0, "M": 82.0, "L": 84.0, "XL": 86.0,
    "2XL": 88.0, "3XL": 90.0, "4XL": 92.0,
}

SHOP_PRODUCTS = {
    "bear-shirt": {"name": "Bear Design", "type": "shirt"},
    "bee-shirt": {"name": "Bee / Beehive Design", "type": "shirt"},
    "lizard-shirt": {"name": "Lizard Design", "type": "shirt"},
    "cat-shirt": {"name": "Cat Design", "type": "shirt"},
    "egyptian-shirt": {"name": "Egyptian Design", "type": "shirt"},
    "golden-snow-jeans": {"name": "Golden Snow™ — Archive Jean No. 001", "type": "jeans"},
    "waistband-jeans": {"name": "HoneyGold Drip™ Waistband Jean No. 002", "type": "jeans"},
}


class CartItem(BaseModel):
    product_id: str
    size: str
    quantity: int = Field(1, ge=1, le=50)


class CheckoutRequest(BaseModel):
    items: List[CartItem]
    origin_url: str


def unit_price(product_id: str, size: str) -> float:
    product = SHOP_PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(400, f"Unknown product: {product_id}")
    prices = SHIRT_SIZE_PRICES if product["type"] == "shirt" else JEAN_SIZE_PRICES
    if size not in prices:
        raise HTTPException(400, f"Invalid size: {size}")
    return prices[size]


@api_router.get("/shop/pricing")
async def get_pricing():
    return {
        "shirt_size_prices": SHIRT_SIZE_PRICES,
        "jean_size_prices": JEAN_SIZE_PRICES,
        "products": SHOP_PRODUCTS,
    }


@api_router.post("/payments/checkout")
async def create_checkout(req: CheckoutRequest):
    if not req.items:
        raise HTTPException(400, "Cart is empty")
    line_items = []
    snapshot = []
    total = 0.0
    for it in req.items:
        price = unit_price(it.product_id, it.size)
        name = SHOP_PRODUCTS[it.product_id]["name"]
        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {"name": f"{name} · Size {it.size}"},
                "unit_amount": int(round(price * 100)),
            },
            "quantity": it.quantity,
        })
        total += price * it.quantity
        snapshot.append({
            "product_id": it.product_id, "name": name,
            "size": it.size, "quantity": it.quantity, "unit_price": price,
        })
    kwargs = dict(
        line_items=line_items,
        mode="payment",
        success_url=f"{req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{req.origin_url}/payment/cancel",
    )
    try:
        session = stripe.checkout.Session.create(
            **kwargs, automatic_tax={"enabled": True}, billing_address_collection="required",
        )
    except stripe.error.StripeError:
        session = stripe.checkout.Session.create(**kwargs)
    await db.payment_transactions.insert_one({
        "session_id": session.id,
        "items": snapshot,
        "amount": total,
        "currency": "usd",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"checkout_url": session.url, "session_id": session.id}


@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id})
    if not record:
        raise HTTPException(404, "Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {
                        "status": "completed", "payment_status": "paid",
                        "stripe_payment_intent_id": s.payment_intent,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    }},
                )
                record = await db.payment_transactions.find_one({"session_id": session_id})
        except stripe.error.StripeError:
            pass
    return {
        "session_id": record["session_id"],
        "status": record["status"],
        "payment_status": record["payment_status"],
    }


@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except (stripe.error.SignatureVerificationError, ValueError):
        raise HTTPException(400, "Invalid signature")
    obj, t = event["data"]["object"], event["type"]
    now = datetime.now(timezone.utc).isoformat()
    if t == "checkout.session.completed":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"], "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": obj.get("payment_status", "paid"),
                      "stripe_payment_intent_id": obj.get("payment_intent"), "updated_at": now}},
        )
    elif t == "checkout.session.async_payment_succeeded":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"]},
            {"$set": {"payment_status": "paid", "updated_at": now}})
    elif t == "checkout.session.async_payment_failed":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"]},
            {"$set": {"status": "failed", "payment_status": "failed", "updated_at": now}})
    elif t == "checkout.session.expired":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"]},
            {"$set": {"status": "expired", "payment_status": "expired", "updated_at": now}})
    return {"status": "ok"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()