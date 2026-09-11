import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  getProduct, getChapter, sizesFor, defaultSize, priceFor, formatPrice,
} from "@/data/archives";
import { useCart } from "@/context/CartContext";
import { Lightbox } from "@/components/Lightbox";
import { SizeGuide } from "@/components/SizeGuide";
import { Reveal } from "@/components/Reveal";

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addItem } = useCart();
  const [size, setSize] = useState(product ? defaultSize(product) : "XL");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  if (!product) return <Navigate to="/collections" replace />;

  const chapter = getChapter(product.characters[0]);
  const price = priceFor(product, size);
  const shownImage = hovering && product.hoverImage ? product.hoverImage : product.image;

  const add = () => {
    addItem(product.id, size, qty);
    toast(`${product.name} · Size ${size} added to your cart`, {
      description: `${qty} × ${formatPrice(price)}`,
    });
  };

  return (
    <main className="hg-arch hg-pdp" data-testid="product-page">
      <div className="hg-pdp-grid">
        <Reveal className="hg-pdp-visual">
          <button
            type="button"
            className="hg-artframe-zoom"
            onClick={() => setZoom(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            data-testid="pdp-image-zoom"
            aria-label="View product image fullscreen"
          >
            <img src={shownImage} alt={product.name} data-testid="pdp-image" />
          </button>
        </Reveal>

        <Reveal className="hg-pdp-info" delay={120}>
          <p className="hg-kicker" data-testid="pdp-character">
            {chapter ? chapter.title : "HoneyGold Drip"}
          </p>
          <h1 className="hg-pdp-title" data-testid="pdp-title">{product.name}</h1>
          <p className="hg-pdp-price" data-testid="pdp-price">{formatPrice(price)}</p>
          <div className="hg-rule" />
          <p className="hg-pdp-desc" data-testid="pdp-description">{product.description}</p>

          <div className="hg-pdp-size-head">
            <p className="hg-pdp-label">Size</p>
            <button
              type="button"
              className="hg-sg-trigger"
              onClick={() => setGuideOpen(true)}
              data-testid="size-guide-button"
            >
              Size Guide
            </button>
          </div>
          <div className="hg-size-row" data-testid="pdp-size-selector">
            {sizesFor(product).map((s) => (
              <button
                key={s}
                className={`hg-size-chip ${size === s ? "hg-size-chip--active" : ""}`}
                onClick={() => setSize(s)}
                data-testid={`pdp-size-${s}`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="hg-pdp-label">Quantity</p>
          <div className="hg-qty" data-testid="pdp-qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} data-testid="pdp-qty-minus">−</button>
            <span data-testid="pdp-qty-value">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(50, q + 1))} data-testid="pdp-qty-plus">+</button>
          </div>

          <button className="hg-btn hg-btn--solid hg-pdp-add" onClick={add} data-testid="pdp-add-to-cart">
            Add to Cart — {formatPrice(price * qty)}
          </button>

          {chapter && (
            <Link to={`/archives/${chapter.slug}`} className="hg-enter hg-pdp-story" data-testid="pdp-story-link">
              Read the {chapter.shortTitle} story
            </Link>
          )}
        </Reveal>
      </div>
      <Lightbox src={shownImage} alt={product.name} open={zoom} onClose={() => setZoom(false)} />
      <SizeGuide type={product.type} open={guideOpen} onClose={() => setGuideOpen(false)} />
    </main>
  );
}
