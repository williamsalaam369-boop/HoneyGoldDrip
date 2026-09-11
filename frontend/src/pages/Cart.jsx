import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getProduct, priceFor, formatPrice } from "@/data/archives";
import { useCart } from "@/context/CartContext";
import { Reveal } from "@/components/Reveal";

const API = process.env.REACT_APP_BACKEND_URL;

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.productId, size: i.size, quantity: i.qty })),
        origin_url: window.location.origin,
      };
      const { data } = await axios.post(`${API}/api/payments/checkout`, payload);
      window.location.href = data.checkout_url;
    } catch (e) {
      toast("Checkout could not be started", { description: "Please try again in a moment." });
      setLoading(false);
    }
  };

  return (
    <main className="hg-arch hg-cartpage" data-testid="cart-page">
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">Your Selection</p>
          <h1 className="hg-arch-title" data-testid="cart-title">Cart</h1>
          <div className="hg-rule hg-rule--center" />
        </Reveal>
      </section>

      {items.length === 0 ? (
        <div className="hg-cart-empty" data-testid="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/collections" className="hg-btn hg-btn--solid" data-testid="cart-empty-shop-link">
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="hg-cart-body">
          <div className="hg-cart-items" data-testid="cart-items">
            {items.map((i) => {
              const p = getProduct(i.productId);
              if (!p) return null;
              const unit = priceFor(p, i.size);
              return (
                <div className="hg-cart-item" key={`${i.productId}-${i.size}`} data-testid={`cart-item-${i.productId}-${i.size}`}>
                  <img src={p.image} alt={p.name} className="hg-cart-thumb" />
                  <div className="hg-cart-meta">
                    <Link to={`/product/${p.id}`} className="hg-cart-name" data-testid={`cart-item-name-${i.productId}-${i.size}`}>
                      {p.name}
                    </Link>
                    <span className="hg-cart-size" data-testid={`cart-item-size-${i.productId}-${i.size}`}>Size: {i.size}</span>
                    <span className="hg-cart-unit" data-testid={`cart-item-price-${i.productId}-${i.size}`}>{formatPrice(unit)}</span>
                  </div>
                  <div className="hg-qty">
                    <button onClick={() => setQty(i.productId, i.size, i.qty - 1)} data-testid={`cart-qty-minus-${i.productId}-${i.size}`}>−</button>
                    <span data-testid={`cart-qty-${i.productId}-${i.size}`}>{i.qty}</span>
                    <button onClick={() => setQty(i.productId, i.size, i.qty + 1)} data-testid={`cart-qty-plus-${i.productId}-${i.size}`}>+</button>
                  </div>
                  <span className="hg-cart-line" data-testid={`cart-line-total-${i.productId}-${i.size}`}>
                    {formatPrice(unit * i.qty)}
                  </span>
                  <button
                    className="hg-cart-remove"
                    onClick={() => removeItem(i.productId, i.size)}
                    data-testid={`cart-remove-${i.productId}-${i.size}`}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="hg-cart-summary" data-testid="cart-summary">
            <p className="hg-kicker">Order Summary</p>
            <div className="hg-cart-total-row">
              <span>Subtotal</span>
              <span data-testid="cart-total">{formatPrice(total)}</span>
            </div>
            <p className="hg-cart-note">Shipping and taxes calculated at checkout.</p>
            <button
              className="hg-btn hg-btn--solid hg-cart-checkout"
              onClick={checkout}
              disabled={loading}
              data-testid="checkout-button"
            >
              {loading ? "Opening secure checkout…" : "Checkout"}
            </button>
            <Link to="/collections" className="hg-enter" data-testid="cart-continue-shopping">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
