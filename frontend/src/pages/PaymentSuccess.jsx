import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "@/context/CartContext";

const API = process.env.REACT_APP_BACKEND_URL;

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState("checking");
  const { clear } = useCart();
  const attempts = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }
    let stop = false;
    const poll = async () => {
      if (stop || attempts.current >= 8) {
        if (attempts.current >= 8) setState("pending");
        return;
      }
      attempts.current += 1;
      try {
        const { data } = await axios.get(`${API}/api/payments/status/${sessionId}`);
        if (data.payment_status === "paid") {
          clear();
          setState("paid");
          return;
        }
        if (["failed", "expired"].includes(data.payment_status)) {
          setState("failed");
          return;
        }
      } catch {
        // keep polling
      }
      setTimeout(poll, 2000);
    };
    poll();
    return () => {
      stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <main className="hg-arch hg-payresult" data-testid="payment-success-page">
      <section className="hg-payresult-inner">
        {state === "checking" && (
          <>
            <div className="hg-pay-spinner" aria-hidden="true" />
            <p className="hg-kicker" data-testid="payment-checking">Confirming your payment…</p>
          </>
        )}
        {state === "paid" && (
          <>
            <img src="/images/official/logo.png" alt="" className="hg-about-emblem" />
            <h1 className="hg-arch-title" data-testid="payment-confirmed">Order Confirmed</h1>
            <div className="hg-rule hg-rule--center" />
            <p className="hg-arch-quote">
              Thank you. Your HoneyGold Drip™ order is confirmed — a receipt is on its way to your email.
            </p>
            <Link to="/collections" className="hg-btn hg-btn--solid" data-testid="payment-continue">
              Continue Shopping
            </Link>
          </>
        )}
        {state === "pending" && (
          <>
            <h1 className="hg-arch-title">Almost There</h1>
            <p className="hg-arch-quote" data-testid="payment-pending">
              Your payment is processing. Check back shortly — your order will confirm automatically.
            </p>
          </>
        )}
        {(state === "failed" || state === "error") && (
          <>
            <h1 className="hg-arch-title">Payment Not Completed</h1>
            <p className="hg-arch-quote" data-testid="payment-failed">
              Your payment did not complete. Your cart is untouched.
            </p>
            <Link to="/cart" className="hg-btn hg-btn--solid" data-testid="payment-back-to-cart">
              Return to Cart
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
