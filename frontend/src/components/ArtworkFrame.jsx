import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

export const ArtworkFrame = ({ label, testId, src, compact = false }) => {
  const [open, setOpen] = useState(false);
  return (
    <figure
      className={`hg-artframe ${compact ? "hg-artframe--compact" : ""} ${src ? "hg-artframe--filled" : ""}`}
      data-testid={testId}
    >
      <div className="hg-artframe-inner">
        {src ? (
          <button
            type="button"
            className="hg-artframe-zoom"
            onClick={() => setOpen(true)}
            data-testid={`${testId}-zoom`}
            aria-label={`View ${label} fullscreen`}
          >
            <img src={src} alt={label} className="hg-artframe-img" loading="lazy" />
          </button>
        ) : (
          <>
            <span className="hg-artframe-monogram" aria-hidden="true">HG</span>
            <span className="hg-artframe-label">{label}</span>
            <span className="hg-artframe-note">Official artwork · awaiting upload</span>
          </>
        )}
      </div>
      {src && (
        <figcaption className="hg-artframe-caption">{label}</figcaption>
      )}
      {src && <Lightbox src={src} alt={label} open={open} onClose={() => setOpen(false)} />}
    </figure>
  );
};
