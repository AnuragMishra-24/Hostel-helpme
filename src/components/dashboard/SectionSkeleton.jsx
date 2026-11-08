import { Skeleton } from '@/components/common/LoadingState';

/** Compact placeholder for dashboard cards while their data loads. */
export default function SectionSkeleton({ lines = 3 }) {
  return (
    <div className="stack" style={{ '--stack-gap': 'var(--space-3)' }} role="status" aria-label="Loading">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === 0 ? '45%' : index % 2 ? '100%' : '80%'} height="0.875rem" />
      ))}
    </div>
  );
}
