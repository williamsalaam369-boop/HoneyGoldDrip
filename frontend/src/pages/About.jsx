import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

const PILLARS = [
  { title: "Every Stitch", note: "Diamond stitching, reinforced seams — construction treated as signature, not afterthought." },
  { title: "Every Piece of Hardware", note: "Honeydrop buttons, honeycomb zippers, HG-engraved pulls — gold that earns its place." },
  { title: "Every Symbol", note: "The Bear, the Bee, the Lizard, the Cat — characters that carry the story of the natural world." },
  { title: "Every Package", note: "The unboxing is a chapter of the story, considered down to the last detail." },
  { title: "Every Collection", note: "Each release adds a page to a single, larger legacy rooted in nature." },
];

export default function About() {
  return (
    <main className="hg-arch hg-about" data-testid="about-page">
      <section className="hg-about-hero">
        <Reveal>
          <img src="/images/official/logo.png" alt="HoneyGold Drip emblem" className="hg-about-emblem" data-testid="about-emblem" />
          <p className="hg-kicker">The Golden Drop™ — Our Promise</p>
          <h1 className="hg-arch-title" data-testid="about-title">The Ecosystem Principle™</h1>
          <div className="hg-rule hg-rule--center" />
        </Reveal>
      </section>

      <section className="hg-about-statement" data-testid="about-statement">
        <Reveal>
          <p className="hg-about-lede">
            HoneyGold Drip™ believes exceptional brands are not built through a
            single product, but through thousands of intentional decisions.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="hg-about-body">
            Every stitch, every piece of hardware, every symbol, every package,
            and every collection contributes to a larger story. We are designing
            a whole ecosystem, one thoughtful detail at a time.
          </p>
        </Reveal>
      </section>

      <section className="hg-about-pillars" data-testid="about-pillars">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} className="hg-pillar" delay={i * 90}>
            <span className="hg-pillar-num">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="hg-pillar-title">{p.title}</h2>
            <p className="hg-pillar-note">{p.note}</p>
          </Reveal>
        ))}
      </section>

      <section className="hg-about-close" data-testid="about-closing">
        <Reveal>
          <p className="hg-ch-quote">
            HoneyGold Drip™ is more than a brand.<br />It is a legacy in the making.
          </p>
          <p className="hg-about-motto">Built Different. Designed to Last.</p>
          <div className="hg-hero-actions">
            <Link to="/archives" className="hg-btn hg-btn--solid" data-testid="about-archives-cta">
              Enter da HG Archives
            </Link>
            <Link to="/collections" className="hg-btn hg-btn--ghost" data-testid="about-shop-cta">
              Explore the Collection
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
