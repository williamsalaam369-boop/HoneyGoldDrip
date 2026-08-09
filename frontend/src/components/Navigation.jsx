import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "da HG Archives", to: "/archives" },
  { label: "About", to: "/about" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
];

const testId = (label) => `nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`;

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        data-testid="site-navigation"
        className={`hg-nav ${scrolled || open ? "hg-nav--scrolled" : ""}`}
      >
        <div className="hg-nav-inner">
          <Link to="/" data-testid="nav-brand-link" className="hg-brand">
            <img
              src="/images/official/emblem.png"
              alt=""
              className="hg-brand-emblem"
              data-testid="nav-brand-emblem"
            />
            HoneyGold Drip<sup>™</sup>
          </Link>

          <nav className="hg-links" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={testId(l.label)}
                className={`hg-link ${location.pathname === l.to ? "hg-link--active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            data-testid="nav-menu-toggle"
            className="hg-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <div
        data-testid="nav-mobile-menu"
        className={`hg-overlay ${open ? "hg-overlay--open" : ""}`}
        aria-hidden={!open}
      >
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            data-testid={`mobile-${testId(l.label)}`}
            className="hg-overlay-link"
            tabIndex={open ? 0 : -1}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
};
