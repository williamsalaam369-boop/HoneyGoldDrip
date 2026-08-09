export const ArtworkFrame = ({ label, testId, src, compact = false }) => (
  <figure
    className={`hg-artframe ${compact ? "hg-artframe--compact" : ""} ${src ? "hg-artframe--filled" : ""}`}
    data-testid={testId}
  >
    <div className="hg-artframe-inner">
      {src ? (
        <img src={src} alt={label} className="hg-artframe-img" loading="lazy" />
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
  </figure>
);
