import { useEffect } from "react";
import { X } from "lucide-react";

const SHIRT_FIT = [
  ["S", "34–36"], ["M", "38–40"], ["L", "42–44"], ["XL", "46–48"],
  ["2XL", "50–52"], ["3XL", "54–56"], ["4XL", "58–60"],
];

const JEAN_FIT = [
  ["S", "28–30"], ["M", "32–34"], ["L", "36–38"], ["XL", "40–42"],
  ["2XL", "44–46"], ["3XL", "48–50"], ["4XL", "52–54"],
];

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export const SizeGuide = ({ type, open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const isShirt = type === "shirt";
  const fit = isShirt ? SHIRT_FIT : JEAN_FIT;
  const garmentCols = isShirt
    ? ["Chest Width", "Body Length", "Sleeve Length"]
    : ["Waist", "Inseam", "Leg Opening"];

  return (
    <div className="hg-sg-overlay" data-testid="size-guide-overlay" onClick={onClose}>
      <aside
        className="hg-sg-panel"
        data-testid="size-guide-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Size Guide"
      >
        <div className="hg-sg-head">
          <div>
            <p className="hg-kicker">HoneyGold Drip™</p>
            <h2 className="hg-sg-title" data-testid="size-guide-title">Size Guide</h2>
          </div>
          <button
            className="hg-lightbox-close hg-sg-close"
            onClick={onClose}
            data-testid="size-guide-close"
            aria-label="Close size guide"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <p className="hg-sg-note" data-testid="size-guide-fit-note">
          General body-fit reference. Measurements are in inches.
        </p>
        <table className="hg-sg-table" data-testid="size-guide-fit-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>{isShirt ? "Chest (body)" : "Waist (body)"}</th>
            </tr>
          </thead>
          <tbody>
            {fit.map(([s, range]) => (
              <tr key={s} data-testid={`size-guide-row-${s}`}>
                <td>{s}</td>
                <td>{range}"</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="hg-sg-note" data-testid="size-guide-garment-note">
          Exact garment measurements — to be announced.
        </p>
        <table className="hg-sg-table hg-sg-table--tba" data-testid="size-guide-garment-table">
          <thead>
            <tr>
              <th>Size</th>
              {garmentCols.map((c) => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s}>
                <td>{s}</td>
                {garmentCols.map((c) => <td key={c}>TBA</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="hg-sg-how" data-testid="size-guide-how">
          <p className="hg-kicker">How to Measure</p>
          <ul>
            {isShirt ? (
              <>
                <li><strong>Chest</strong> — measure around the fullest part of your chest, keeping the tape level under your arms.</li>
                <li><strong>Body length</strong> — from the highest point of the shoulder straight down to the hem.</li>
                <li><strong>Sleeve</strong> — from the shoulder seam to the end of the cuff.</li>
              </>
            ) : (
              <>
                <li><strong>Waist</strong> — measure around your natural waistline, where the jean will sit.</li>
                <li><strong>Inseam</strong> — from the top of the inner thigh down to the ankle.</li>
                <li><strong>Leg opening</strong> — the width across the bottom hem of the leg.</li>
              </>
            )}
            <li>If you are between sizes, choose according to your preferred fit.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
