import { Link, useSearchParams } from "react-router-dom";
import { PRODUCTS, getChapter, startingPrice, formatPrice } from "@/data/archives";
import { Reveal } from "@/components/Reveal";

const ProductCard = ({ p, index }) => (
  <Reveal delay={(index % 3) * 100}>
    <article className="hg-product-card hg-product-card--shop" data-testid={`product-card-${p.id}`}>
      <Link to={`/product/${p.id}`} className="hg-product-visual" data-testid={`product-image-link-${p.id}`}>
        <img src={p.image} alt={p.name} className="hg-product-img" loading="lazy" />
        {p.hoverImage && (
          <img src={p.hoverImage} alt="" className="hg-product-img hg-product-img--hover" loading="lazy" />
        )}
      </Link>
      <span className="hg-product-char" data-testid={`product-category-${p.id}`}>{p.category}</span>
      <span className="hg-product-name" data-testid={`product-name-${p.id}`}>{p.name}</span>
      <span className="hg-product-price" data-testid={`product-price-${p.id}`}>
        From {formatPrice(startingPrice(p))}
      </span>
      <span className="hg-product-sizes" data-testid={`product-sizes-${p.id}`}>Sizes S – 4XL</span>
      <Link to={`/product/${p.id}`} className="hg-btn hg-btn--ghost hg-btn--small hg-view-btn" data-testid={`view-product-${p.id}`}>
        View Product
      </Link>
    </article>
  </Reveal>
);

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const character = params.get("c");
  const chapter = character ? getChapter(character) : null;

  const filtered = character
    ? PRODUCTS.filter((p) => p.characters.includes(character))
    : PRODUCTS;
  const shirts = filtered.filter((p) => p.type === "shirt");
  const jeans = filtered.filter((p) => p.type === "jeans");

  return (
    <main className="hg-arch hg-shop" data-testid="collections-page">
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">The House Creates</p>
          <h1 className="hg-arch-title" data-testid="collections-title">Collections</h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="collections-statement">
            Garments born from the stories inside da HG Archives.
          </p>
          {chapter && (
            <button
              className="hg-chip hg-chip--active hg-filter-pill"
              onClick={() => setParams({})}
              data-testid="collections-clear-filter"
            >
              Showing {chapter.shortTitle} pieces · Clear ✕
            </button>
          )}
        </Reveal>
      </section>

      {shirts.length > 0 && (
        <section className="hg-shop-section" data-testid="collections-shirts">
          <Reveal className="hg-shop-section-head">
            <span className="hg-chapter-numeral">S</span>
            <div>
              <p className="hg-kicker">Category</p>
              <h2 className="hg-chapter-title">Shirts</h2>
            </div>
          </Reveal>
          <div className="hg-shop-grid" data-testid="shirts-grid">
            {shirts.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </section>
      )}

      {jeans.length > 0 && (
        <section className="hg-shop-section" data-testid="collections-jeans">
          <Reveal className="hg-shop-section-head">
            <span className="hg-chapter-numeral">J</span>
            <div>
              <p className="hg-kicker">Category</p>
              <h2 className="hg-chapter-title">Jeans</h2>
            </div>
          </Reveal>
          <div className="hg-shop-grid" data-testid="jeans-grid">
            {jeans.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="hg-cart-empty" data-testid="collections-empty">
          <p>No pieces in this selection yet.</p>
          <button className="hg-btn hg-btn--solid" onClick={() => setParams({})} data-testid="collections-show-all">
            Show All
          </button>
        </div>
      )}
    </main>
  );
}
