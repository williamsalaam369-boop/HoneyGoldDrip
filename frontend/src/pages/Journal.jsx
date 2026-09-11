import { Reveal } from "@/components/Reveal";

const UPCOMING = [
  { category: "Fashion", image: "/images/archives/brown-bear.jpg" },
  { category: "Culture", image: "/images/archives/cat-dusk.jpg" },
  { category: "Design", image: "/images/archives/honeycomb.jpg" },
  { category: "Behind the Scenes", image: "/images/archives/bee-meadow.jpg" },
  { category: "Fashion", image: "/images/archives/black-bear.jpg" },
  { category: "Culture", image: "/images/archives/lizard-stone.jpg" },
];

export default function Journal() {
  return (
    <main className="hg-arch hg-journal" data-testid="journal-page">
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">The House Writes</p>
          <h1 className="hg-arch-title" data-testid="journal-title">Journal</h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="journal-statement">
            Fashion, culture, design, and the world behind HoneyGold Drip™ —
            told one story at a time.
          </p>
        </Reveal>
      </section>

      <section className="hg-journal-featured" data-testid="journal-featured">
        <Reveal className="hg-featured-visual">
          <img src="/images/archives/canopy.jpg" alt="The HoneyGold landscape" loading="lazy" />
          <span className="hg-featured-tag" data-testid="journal-featured-tag">Featured Story</span>
        </Reveal>
        <Reveal className="hg-featured-copy" delay={140}>
          <p className="hg-kicker">Editorial Placeholder</p>
          <h2 className="hg-chapter-title" data-testid="journal-featured-title">
            The first story is being written.
          </h2>
          <p className="hg-chapter-lede" data-testid="journal-featured-note">
            The house's first feature will appear here — the ideas, places, and
            craft behind HoneyGold Drip™, told in the house's own words. No
            invented history, no filler; only the real story when it is ready.
          </p>
          <span className="hg-journal-soon" data-testid="journal-featured-soon">Publishing soon</span>
        </Reveal>
      </section>

      <section className="hg-journal-grid-wrap" data-testid="journal-grid">
        <Reveal className="hg-shop-section-head">
          <span className="hg-chapter-numeral">J</span>
          <div>
            <p className="hg-kicker">Upcoming</p>
            <h2 className="hg-chapter-title">Stories to Come</h2>
          </div>
        </Reveal>
        <div className="hg-journal-grid">
          {UPCOMING.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <article className="hg-journal-card" data-testid={`journal-card-${i}`}>
                <div className="hg-journal-card-visual">
                  <img src={s.image} alt="" loading="lazy" />
                </div>
                <span className="hg-product-char">{s.category}</span>
                <span className="hg-journal-card-title">Editorial placeholder — story to come</span>
                <span className="hg-journal-soon">In the making</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
