export const ArtworkFrame = ({ label, testId, compact = false }) => (
  <figure
    className={`hg-artframe ${compact ? "hg-artframe--compact" : ""}`}
    data-testid={testId}
  >
    <div className="hg-artframe-inner">
      <span className="hg-artframe-monogram" aria-hidden="true">HG</span>
      <span className="hg-artframe-label">{label}</span>
      <span className="hg-artframe-note">Official artwork · awaiting upload</span>
    </div>
  </figure>
);
