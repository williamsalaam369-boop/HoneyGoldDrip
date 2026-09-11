import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Music2 } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Collections", to: "/collections" },
  { label: "da HG Archives", to: "/archives" },
  { label: "Journal", to: "/journal" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const CUSTOMER_LINKS = [
  { label: "Shipping", to: "/policies/shipping" },
  { label: "Returns", to: "/policies/returns" },
  { label: "Privacy Policy", to: "/policies/privacy" },
  { label: "Terms", to: "/policies/terms" },
];

const SOCIALS = [
  { label: "Instagram", Icon: Instagram },
  { label: "X / Twitter", Icon: Twitter },
  { label: "YouTube", Icon: Youtube },
  { label: "TikTok", Icon: Music2 },
];

export const Footer = () => (
  <footer className="hg-footer" data-testid="site-footer">
    <div className="hg-footer-inner">
      <div className="hg-footer-brand">
        <img
          src="/images/official/logo.png"
          alt="HoneyGold Drip emblem"
          className="hg-footer-emblem"
          data-testid="footer-emblem"
        />
        <span className="hg-footer-wordmark">HoneyGold Drip<sup>™</sup></span>
        <p className="hg-footer-tag">Premium Fashion Rooted in Nature</p>
      </div>

      <nav className="hg-footer-col" aria-label="Quick links" data-testid="footer-quick-links">
        <p className="hg-kicker">Explore</p>
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="hg-footer-link"
            data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <nav className="hg-footer-col" aria-label="Customer care" data-testid="footer-customer-links">
        <p className="hg-kicker">Customer Care</p>
        {CUSTOMER_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="hg-footer-link"
            data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="hg-footer-col" data-testid="footer-social">
        <p className="hg-kicker">Follow the House</p>
        <div className="hg-footer-socials">
          {SOCIALS.map(({ label, Icon }) => (
            <span
              key={label}
              className="hg-footer-social"
              title={`${label} — coming soon`}
              aria-label={`${label} — coming soon`}
              data-testid={`footer-social-${label.split(" ")[0].toLowerCase()}`}
            >
              <Icon size={17} strokeWidth={1.5} />
            </span>
          ))}
        </div>
        <p className="hg-footer-soon">Official channels — coming soon</p>
      </div>
    </div>

    <div className="hg-footer-base">
      <span data-testid="footer-copyright">
        © {new Date().getFullYear()} HoneyGold Drip™. All rights reserved.
      </span>
      <span className="hg-footer-drop">Preserved in Honey. Eternalized in Legacy.</span>
    </div>
  </footer>
);
