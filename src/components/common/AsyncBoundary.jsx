import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

/**
 * Standard loading / error handling for a useAsync() result.
 * Shows `skeleton` (or a spinner) on first load, ErrorState with retry on failure, and otherwise calls
 * children(data). Data from a previous load stays visible while a reload is in flight.
 * Empty data is the caller's job — children(data) decides what "empty" looks like.
 */
export default function AsyncBoundary({ state, loadingLabel = 'Loading…', errorTitle, skeleton, children }) {
  const { data, error, loading, reload } = state;
  if (error) return <ErrorState title={errorTitle} message={error.message} onRetry={reload} />;
  if (loading && data == null) return skeleton ?? <LoadingState label={loadingLabel} />;
  return children(data);
}
