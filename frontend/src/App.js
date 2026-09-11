import "@/App.css";
import "@/styles/archives.css";
import "@/styles/shop.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import Archives from "@/pages/Archives";
import ArchiveChapter from "@/pages/ArchiveChapter";
import Collections from "@/pages/Collections";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import About from "@/pages/About";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <main data-testid="homepage" className="hg-home">
    <section className="hg-hero" data-testid="hero-section">
      <video
        className="hg-hero-video"
        data-testid="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/honeygold-intro.webm" type="video/webm" />
        <source src="/videos/honeygold-intro.mp4" type="video/mp4" />
      </video>
      <div className="hg-hero-scrim" />
      <div className="hg-hero-content">
        <img
          src="/images/official/logo.png"
          alt="HoneyGold Drip emblem"
          className="hg-hero-emblem"
          data-testid="hero-emblem"
        />
        <h1 className="hg-hero-logo" data-testid="hero-logo">
          HoneyGold Drip<sup>™</sup>
        </h1>
        <p className="hg-hero-tagline" data-testid="hero-tagline">
          Premium Fashion Rooted in Nature
        </p>
        <div className="hg-rule hg-rule--center" />
        <p className="hg-hero-sub" data-testid="hero-subtext">
          Crafted through storytelling.
          <br />
          Inspired by nature.
          <br />
          Designed to endure.
        </p>
        <div className="hg-hero-actions">
          <Link
            to="/archives"
            data-testid="hero-archives-button"
            className="hg-btn hg-btn--solid"
          >
            Enter da HG Archives
          </Link>
          <Link
            to="/collections"
            data-testid="hero-collection-button"
            className="hg-btn hg-btn--ghost"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
    <section className="hg-section hg-section--moss">
      <p>Scroll — the navigation reveals its glass state</p>
    </section>
    <section className="hg-section hg-section--bark">
      <p>Collections · coming soon</p>
    </section>
  </main>
);

const ComingSoon = () => (
  <main className="hg-home">
    <section className="hg-hero-standin" data-testid="coming-soon">
      <p className="hg-note" data-testid="coming-soon-note">
        This page is being crafted
      </p>
      <div className="hg-rule" />
      <Link to="/" data-testid="coming-soon-home-link" className="hg-return">
        Return home
      </Link>
    </section>
  </main>
);

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/archives/:slug" element={<ArchiveChapter />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#14100a",
                color: "#f3ecdd",
                border: "1px solid rgba(201, 162, 75, 0.35)",
                fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.04em",
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
