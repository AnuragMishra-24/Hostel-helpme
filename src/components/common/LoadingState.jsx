export function Skeleton({ width = '100%', height = '1rem', className, style }) {
  return <span className={`skeleton ${className ?? ''}`.trim()} style={{ width, height, ...style }} aria-hidden="true" />;
}

/** Spinner + label for full-section loading. Use Skeleton for layout-shaped placeholders. */
export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary)' }} aria-hidden="true" />
      <p className="state__description">{label}</p>
    </div>
  );
}
