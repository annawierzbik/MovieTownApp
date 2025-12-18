export const LaserBackground = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className={`laser laser-${i + 1}`} />
    ))}
  </>
);
