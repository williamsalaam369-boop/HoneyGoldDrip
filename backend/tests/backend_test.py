"""Backend tests for HoneyGold Drip shop: pricing, Stripe checkout, payment status."""
import os
import pytest
import requests
from dotenv import dotenv_values
from pymongo import MongoClient

frontend_env = dotenv_values("/app/frontend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = base_url.rstrip("/")

backend_env = dotenv_values("/app/backend/.env")
MONGO_URL = backend_env.get("MONGO_URL")
DB_NAME = backend_env.get("DB_NAME")

SHIRT = {"S": 48.0, "M": 50.0, "L": 52.0, "XL": 54.0, "2XL": 56.0, "3XL": 58.0, "4XL": 60.0}
JEAN = {"S": 80.0, "M": 82.0, "L": 84.0, "XL": 86.0, "2XL": 88.0, "3XL": 90.0, "4XL": 92.0}
PRODUCT_IDS = ["bear-shirt", "bee-shirt", "lizard-shirt", "cat-shirt", "egyptian-shirt",
               "golden-snow-jeans", "waistband-jeans"]


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def mongo():
    if not MONGO_URL or not DB_NAME:
        pytest.skip("MONGO_URL/DB_NAME missing")
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="session")
def created_sessions():
    return []


# --- health ---
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("message") == "Hello World"


# --- pricing ---
class TestPricing:
    def test_pricing_exact(self, api):
        r = api.get(f"{BASE_URL}/api/shop/pricing")
        assert r.status_code == 200
        d = r.json()
        assert d["shirt_size_prices"] == SHIRT
        assert d["jean_size_prices"] == JEAN
        assert sorted(d["products"].keys()) == sorted(PRODUCT_IDS)
        assert d["products"]["bear-shirt"]["name"] == "Bear Design"
        assert d["products"]["golden-snow-jeans"]["type"] == "jeans"


# --- checkout ---
class TestCheckout:
    def test_checkout_creates_session_and_transaction(self, api, mongo, created_sessions):
        payload = {
            "items": [
                {"product_id": "bear-shirt", "size": "2XL", "quantity": 1},
                {"product_id": "waistband-jeans", "size": "S", "quantity": 2},
            ],
            "origin_url": BASE_URL,
        }
        r = api.post(f"{BASE_URL}/api/payments/checkout", json=payload)
        assert r.status_code == 200, r.text[:500]
        d = r.json()
        assert "checkout_url" in d and "session_id" in d
        assert d["checkout_url"].startswith("https://checkout.stripe.com")
        assert d["session_id"].startswith("cs_")
        created_sessions.append(d["session_id"])

        rec = mongo.payment_transactions.find_one({"session_id": d["session_id"]})
        assert rec is not None
        assert rec["amount"] == pytest.approx(216.0)
        assert rec["currency"] == "usd"
        assert rec["payment_status"] == "pending"
        assert rec["status"] == "initiated"
        sizes = {i["size"]: i["unit_price"] for i in rec["items"]}
        assert sizes["2XL"] == 56.0 and sizes["S"] == 80.0

    def test_checkout_invalid_product(self, api):
        r = api.post(f"{BASE_URL}/api/payments/checkout", json={
            "items": [{"product_id": "nope-shirt", "size": "S", "quantity": 1}],
            "origin_url": BASE_URL})
        assert r.status_code == 400

    def test_checkout_invalid_size(self, api):
        r = api.post(f"{BASE_URL}/api/payments/checkout", json={
            "items": [{"product_id": "bear-shirt", "size": "5XL", "quantity": 1}],
            "origin_url": BASE_URL})
        assert r.status_code == 400

    def test_checkout_empty_items(self, api):
        r = api.post(f"{BASE_URL}/api/payments/checkout", json={"items": [], "origin_url": BASE_URL})
        assert r.status_code == 400

    def test_checkout_invalid_quantity(self, api):
        r = api.post(f"{BASE_URL}/api/payments/checkout", json={
            "items": [{"product_id": "bear-shirt", "size": "S", "quantity": 0}],
            "origin_url": BASE_URL})
        assert r.status_code == 422

    def test_checkout_all_sizes_price_math(self, api, mongo, created_sessions):
        """Each shirt size price flows through to transaction amount."""
        for size, expected in SHIRT.items():
            r = api.post(f"{BASE_URL}/api/payments/checkout", json={
                "items": [{"product_id": "bee-shirt", "size": size, "quantity": 1}],
                "origin_url": BASE_URL})
            assert r.status_code == 200, r.text[:300]
            sid = r.json()["session_id"]
            created_sessions.append(sid)
            rec = mongo.payment_transactions.find_one({"session_id": sid})
            assert rec["amount"] == pytest.approx(expected), f"size {size}"


# --- payment status ---
class TestPaymentStatus:
    def test_status_pending_for_fresh_session(self, api, created_sessions):
        # create a fresh session inside this test (xdist workers do not share fixtures)
        cr = api.post(f"{BASE_URL}/api/payments/checkout", json={
            "items": [{"product_id": "cat-shirt", "size": "L", "quantity": 1}],
            "origin_url": BASE_URL})
        assert cr.status_code == 200, cr.text[:300]
        sid = cr.json()["session_id"]
        created_sessions.append(sid)
        r = api.get(f"{BASE_URL}/api/payments/status/{sid}")
        assert r.status_code == 200, r.text[:300]
        d = r.json()
        assert d["session_id"] == sid
        assert d["payment_status"] == "pending"
        assert d["status"] == "initiated"

    def test_status_unknown_session_404(self, api):
        r = api.get(f"{BASE_URL}/api/payments/status/cs_test_TEST_does_not_exist_123")
        assert r.status_code == 404


# --- webhook signature ---
class TestWebhook:
    def test_webhook_rejects_bad_signature(self, api):
        r = requests.post(f"{BASE_URL}/api/stripe/webhook", data=b'{"type":"checkout.session.completed"}',
                          headers={"stripe-signature": "t=1,v1=bad"})
        assert r.status_code == 400


@pytest.fixture(scope="session", autouse=True)
def cleanup(created_sessions, request):
    yield
    if not MONGO_URL or not DB_NAME:
        return
    c = MongoClient(MONGO_URL)
    if created_sessions:
        c[DB_NAME].payment_transactions.delete_many({"session_id": {"$in": created_sessions}})
    c.close()
