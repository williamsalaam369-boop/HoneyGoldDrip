import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CHAPTERS, PRODUCTS } from "@/data/archives";
import { Reveal } from "@/components/Reveal";

const FILTERS = [
  { slug: "all", label: "All" },
  ...CHAPTERS.map((c) => ({ slug: c.slug, label: c.shortTitle })),
];

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const [cartCount, setCartCount] = useState(0);
  const active = params.get("c") || "all";

  const products = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.character === active)),
    [active]
  );

  const setFilter = (slug) => {
    if (slug === "all") setParams({});
    else setParams({ c: slug });
  };

  const addToCart = (product) => {
    setCartCount((n) => n + 1);
    toast(`${product.name} added to your cart`, {
      description: "Checkout opens with the full Shop release.",
    });
  };

  return (
    <main className="hg-arch hg-shop" data-testid="collections-page">
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">The House Creates</p>
          <h1 className="hg-arch-title" data-testid="collections-title">
            Collections
          </h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="collections-statement">
            Garments born from the stories inside da HG Archives.
          </p>
        </Reveal>
      </section>

      <div className="hg-shop-bar">
        <div className="hg-chips" data-testid="collections-filters" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.slug}
              className={`hg-chip ${active === f.slug ? "hg-chip--active" : ""}`}
              onClick={() => setFilter(f.slug)}
              data-testid={`filter-chip-${f.slug}`}
              role="tab"
              aria-selected={active === f.slug}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="hg-cart" data-testid="cart-count">
          Cart · {cartCount}
        </span>
      </div>

      <section className="hg-shop-grid" data-testid="collections-grid">
        {products.map((p, i) => {
          const chapter = CHAPTERS.find((c) => c.slug === p.character);
          return (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <article className="hg-product-card hg-product-card--shop" data-testid={`product-card-${p.id}`}>
                <div className="hg-product-visual">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="hg-product-img" loading="lazy" />
                  ) : (
                    <>
                      <span className="hg-artframe-monogram">HG</span>
                      <span className="hg-artframe-note">Product imagery coming soon</span>
                    </>
                  )}
                </div>
                <span className="hg-product-char">{chapter.shortTitle}</span>
                <span className="hg-product-name">{p.name}</span>
                <span className="hg-product-price">${p.price}</span>
                <div className="hg-product-actions">
                  <button
                    className="hg-btn hg-btn--solid hg-btn--small"
                    onClick={() => addToCart(p)}
                    data-testid={`add-to-cart-${p.id}`}
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/archives/${p.character}`}
                    className="hg-enter"
                    data-testid={`product-story-link-${p.id}`}
                  >
                    Read the story
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </main>
  );
}
