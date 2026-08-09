import { Link } from "react-router-dom";
import { CHAPTERS } from "@/data/archives";
import { Reveal } from "@/components/Reveal";

const bears = CHAPTERS.filter((c) => c.group === "The Bear");
const soloChapters = CHAPTERS.filter((c) => !c.group);

export default function Archives() {
  return (
    <main className="hg-arch" data-testid="archives-page">
      <section
        className="hg-arch-intro"
        data-testid="archives-intro"
        style={{ backgroundImage: "url(/images/archives/canopy.jpg)" }}
      >
        <div className="hg-arch-intro-scrim" />
        <div className="hg-arch-intro-content">
          <p className="hg-kicker" data-testid="archives-kicker">The World Behind the House</p>
          <h1 className="hg-arch-title" data-testid="archives-title">
            Da HG Archives
          </h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="archives-statement">
            “Every creation tells a story that reminds us to honor the world
            that gives us life—a world that continues to be our home.”
          </p>
          <div className="hg-scroll-hint" aria-hidden="true" />
        </div>
      </section>

      <section className="hg-arch-section hg-legacy" data-testid="archives-legacy">
        <Reveal className="hg-legacy-art">
          <img
            src="/images/official/legacy.png"
            alt="HoneyGold Drip — Preserved in Honey. Eternalized in Legacy."
            loading="lazy"
            data-testid="legacy-artwork"
          />
        </Reveal>
        <Reveal className="hg-legacy-copy" delay={140}>
          <p className="hg-kicker">The House Legacy</p>
          <h2 className="hg-chapter-title">Preserved in Honey.<br />Eternalized in Legacy.</h2>
          <p className="hg-chapter-lede">
            Official HoneyGold Drip™ artwork — the house's testament to
            preservation, memory, and the golden thread that carries every
            story forward.
          </p>
        </Reveal>
      </section>

      <section className="hg-arch-section" data-testid="chapter-bear-section">
        <Reveal className="hg-chapterhead">
          <span className="hg-chapter-numeral">I</span>
          <div>
            <p className="hg-kicker">Chapter One</p>
            <h2 className="hg-chapter-title">The Bear</h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="hg-chapter-lede" data-testid="bear-chapter-lede">
            Strength. Labor. Nature. Perseverance. Two keepers of the same
            forest — one of the golden hours, one of the dark. Enter each
            story separately.
          </p>
        </Reveal>
        <div className="hg-bear-doors">
          {bears.map((b, i) => (
            <Reveal key={b.slug} delay={i * 140}>
              <Link
                to={`/archives/${b.slug}`}
                className="hg-door"
                data-testid={`chapter-door-${b.slug}`}
              >
                <img src={b.heroImage} alt={b.title} loading="lazy" />
                <div className="hg-door-veil" />
                <div className="hg-door-label">
                  <span className="hg-kicker">{b.tagline}</span>
                  <span className="hg-door-title">{b.title}</span>
                  <span className="hg-enter">Enter the story</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {soloChapters.map((c, i) => (
        <section
          key={c.slug}
          className={`hg-arch-section hg-chapter-row ${i % 2 ? "hg-chapter-row--flip" : ""}`}
          data-testid={`chapter-row-${c.slug}`}
        >
          <Reveal className="hg-chapter-img">
            <Link to={`/archives/${c.slug}`} data-testid={`chapter-img-link-${c.slug}`}>
              <img src={c.heroImage} alt={c.title} loading="lazy" />
            </Link>
          </Reveal>
          <Reveal className="hg-chapter-copy" delay={140}>
            <span className="hg-chapter-numeral">{c.numeral}</span>
            <p className="hg-kicker">{c.chapter}</p>
            <h2 className="hg-chapter-title">{c.title}</h2>
            <p className="hg-chapter-lede">{c.tagline}</p>
            <Link
              to={`/archives/${c.slug}`}
              className="hg-enter"
              data-testid={`chapter-link-${c.slug}`}
            >
              Enter the chapter
            </Link>
          </Reveal>
        </section>
      ))}

      <section className="hg-arch-outro" data-testid="archives-outro">
        <Reveal>
          <p className="hg-kicker">From Story to Craft</p>
          <h2 className="hg-chapter-title">The stories become the garments.</h2>
          <Link
            to="/collections"
            className="hg-btn hg-btn--solid hg-outro-btn"
            data-testid="archives-shop-cta"
          >
            Explore the Collection
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
