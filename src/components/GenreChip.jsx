export default function GenreChip({ label, active, onClick, color }) {
  const colors = {
    lavender: 'bg-primary/10 border-primary/30 text-primary',
    peach: 'bg-amber/10 border-amber/30 text-amber',
    dusty: 'bg-primary/10 border-primary/30 text-primary',
    mist: 'bg-accent/10 border-accent/30 text-accent',
    muted: 'bg-muted/10 border-muted/30 text-muted',
  };

  return (
    <button
      onClick={onClick}
      className={`genre-chip transition-all duration-250 ${
        active ? (colors[color] || colors.lavender) : ''
      }`}
    >
      {label}
    </button>
  );
}
