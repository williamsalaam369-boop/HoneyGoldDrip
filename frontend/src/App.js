import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

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
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
