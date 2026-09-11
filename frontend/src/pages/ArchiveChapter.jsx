import { Link, Navigate, useParams } from "react-router-dom";
import { CHAPTERS, getChapter, productsFor, startingPrice, formatPrice } from "@/data/archives";
import { Reveal } from "@/components/Reveal";
import { ArtworkFrame } from "@/components/ArtworkFrame";

const PARTICLES = [
  { left: "6%", size: 5, dur: 11, delay: 0 },
  { left: "14%", size: 3, dur: 14, delay: 2 },
  { left: "24%", size: 6, dur: 10, delay: 4 },
  { left: "33%", size: 4, dur: 13, delay: 1 },
  { left: "42%", size: 5, dur: 12, delay: 6 },
  { left: "51%", size: 3, dur: 15, delay: 3 },
  { left: "60%", size: 6, dur: 11, delay: 5 },
  { left: "68%", size: 4, dur: 13, delay: 0.5 },
  { left: "76%", size: 5, dur: 10, delay: 7 },
  { left: "84%", size: 3, dur: 14, delay: 2.5 },
  { left: "91%", size: 5, dur: 12, delay: 4.5 },
  { left: "96%", size: 4, dur: 15, delay: 1.5 },
];

const Particles = () => (
  <div className="hg-particles" aria-hidden="true">
    {PARTICLES.map((p, i) => (
      <span
        key={i}
        className="hg-particle"
        style={{
          left: p.left,
          width: p.size,
          height: p.size,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }}
      />
    ))}
  </div>
);

export default function ArchiveChapter() {
  const { slug } = useParams();
  const chapter = getChapter(slug);
  if (!chapter) return <Navigate to="/archives" replace />;

  const idx = CHAPTERS.findIndex((c) => c.slug === slug);
  const prev = CHAPTERS[(idx - 1 + CHAPTERS.length) % CHAPTERS.length];
  const next = CHAPTERS[(idx + 1) % CHAPTERS.length];
  const products = productsFor(slug);
  const isBee = slug === "bee";

  return (
    <main className="hg-arch" data-testid={`chapter-page-${slug}`}>
      <section
        className="hg-ch-hero"
        data-testid="chapter-hero"
        style={{ backgroundImage: `url(${chapter.heroImage})` }}
      >
        <div className="hg-arch-intro-scrim" />
        {isBee && <Particles />}
        <div className="hg-ch-hero-content">
          <p className="hg-kicker" data-testid="chapter-kicker">
            {chapter.chapter}
            {chapter.group ? ` · ${chapter.group}` : ""}
          </p>
          <h1 className="hg-arch-title" data-testid="chapter-title">
            {chapter.title}
          </h1>
          <p className="hg-arch-quote" data-testid="chapter-tagline">
            {chapter.tagline}
          </p>
        </div>
      </section>

      {chapter.essence.length > 0 && (
        <section
          className={`hg-essence ${chapter.essenceLocked ? "hg-essence--locked" : ""}`}
          data-testid="chapter-essence"
        >
          {chapter.essence.map((w) => (
            <Reveal key={w} className="hg-essence-word-wrap">
              <span className="hg-essence-word">{w}</span>
            </Reveal>
          ))}
        </section>
      )}

      <section className="hg-ch-story" data-testid="chapter-story">
        {isBee && <Particles />}
        <Reveal>
          <p className="hg-kicker">The Story</p>
        </Reveal>
        {chapter.story.map((p, i) => (
          <Reveal key={i} delay={i * 100}>
            <p className="hg-story-p">{p}</p>
          </Reveal>
        ))}
        <Reveal delay={200}>
          <p className="hg-ch-quote" data-testid="chapter-quote">
            “{chapter.quote}”
          </p>
        </Reveal>
      </section>

      <section className="hg-ch-grid hg-arch-section" data-testid="chapter-artwork-section">
        <Reveal>
          <ArtworkFrame
            label={`${chapter.title} — Official Artwork`}
            testId={`artwork-frame-${slug}`}
            src={chapter.artwork}
          />
        </Reveal>
        <Reveal className="hg-inspo" delay={140}>
          <p className="hg-kicker">Design Inspiration</p>
          <ul className="hg-inspo-list" data-testid="chapter-inspiration">
            {chapter.inspiration.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section
        className="hg-parallax"
        data-testid="chapter-environment"
        style={{ backgroundImage: `url(${chapter.envImage})` }}
      >
        <span className="hg-parallax-caption">The {chapter.shortTitle} landscape</span>
      </section>

      <section className="hg-arch-section hg-history" data-testid="chapter-history">
        <Reveal>
          <p className="hg-kicker">Collection History</p>
        </Reveal>
        {chapter.history.map((h, i) => (
          <Reveal key={i} className="hg-history-row" delay={i * 100}>
            <span className="hg-history-era">{h.era}</span>
            <span className="hg-history-note">{h.note}</span>
          </Reveal>
        ))}
      </section>

      <section className="hg-arch-section hg-ch-shop" data-testid="chapter-products">
        <Reveal>
          <p className="hg-kicker">From the {chapter.shortTitle} Collection</p>
        </Reveal>
        <div className="hg-product-strip">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <Link
                to={`/product/${p.id}`}
                className="hg-product-card"
                data-testid={`chapter-product-${p.id}`}
              >
                <div className="hg-product-visual">
                  <img src={p.image} alt={p.name} className="hg-product-img" loading="lazy" />
                  {p.hoverImage && (
                    <img src={p.hoverImage} alt="" className="hg-product-img hg-product-img--hover" loading="lazy" />
                  )}
                </div>
                <span className="hg-product-name">{p.name}</span>
                <span className="hg-product-price">From {formatPrice(startingPrice(p))}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <Link
            to={`/collections?c=${slug}`}
            className="hg-btn hg-btn--solid hg-outro-btn"
            data-testid="chapter-shop-cta"
          >
            Shop the Collection
          </Link>
        </Reveal>
      </section>

      <nav className="hg-ch-nav" aria-label="Chapter navigation" data-testid="chapter-nav">
        <Link to={`/archives/${prev.slug}`} className="hg-ch-nav-link" data-testid="chapter-prev">
          <span className="hg-kicker">Previous</span>
          <span>{prev.title}</span>
        </Link>
        <Link to="/archives" className="hg-enter" data-testid="chapter-index-link">
          All chapters
        </Link>
        <Link
          to={`/archives/${next.slug}`}
          className="hg-ch-nav-link hg-ch-nav-link--right"
          data-testid="chapter-next"
        >
          <span className="hg-kicker">Next</span>
          <span>{next.title}</span>
        </Link>
      </nav>
    </main>
  );
}
