export default function GenreChip({ label, active, onClick, color }) {
  const colors = {
    lavender: 'bg-lavender/15 border-lavender/40 text-lavender',
    peach: 'bg-peach/15 border-peach/40 text-peach',
    dusty: 'bg-dusty/15 border-dusty/40 text-dusty',
    mist: 'bg-mist/15 border-mist/40 text-mist',
    muted: 'bg-muted/15 border-muted/40 text-muted',
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
