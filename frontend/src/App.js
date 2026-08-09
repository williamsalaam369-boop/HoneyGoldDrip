import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const Home = () => (
  <main data-testid="homepage-placeholder" className="hg-home">
    <section className="hg-hero-standin" data-testid="hero-standin">
      <h1 className="hg-mark">
        HoneyGold Drip<sup>™</sup>
      </h1>
      <div className="hg-rule" />
      <p className="hg-note">Homepage hero · in production</p>
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
