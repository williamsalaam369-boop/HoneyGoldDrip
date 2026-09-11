import { useEffect } from "react";
import { X } from "lucide-react";

export const Lightbox = ({ src, alt, open, onClose }) => {
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
  return (
    <div className="hg-lightbox" data-testid="artwork-lightbox" onClick={onClose}>
      <button
        className="hg-lightbox-close"
        data-testid="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={22} strokeWidth={1.5} />
      </button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
      <span className="hg-lightbox-caption">{alt}</span>
    </div>
  );
};
