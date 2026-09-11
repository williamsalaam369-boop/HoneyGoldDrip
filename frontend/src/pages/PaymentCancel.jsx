import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <main className="hg-arch hg-payresult" data-testid="payment-cancel-page">
      <section className="hg-payresult-inner">
        <h1 className="hg-arch-title">Checkout Cancelled</h1>
        <div className="hg-rule hg-rule--center" />
        <p className="hg-arch-quote" data-testid="payment-cancelled">
          No charge was made. Your cart is exactly as you left it.
        </p>
        <Link to="/cart" className="hg-btn hg-btn--solid" data-testid="cancel-back-to-cart">
          Return to Cart
        </Link>
      </section>
    </main>
  );
}
