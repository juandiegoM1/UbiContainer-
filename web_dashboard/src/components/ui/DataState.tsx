import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

type DataStateProps = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  errorTitle?: string;
  onRetry?: () => void;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  /** Custom skeleton JSX to show while loading instead of the default spinner */
  skeleton?: React.ReactNode;
  children: React.ReactNode;
};

export function DataState({
  loading = false,
  error = null,
  empty = false,
  loadingMessage,
  emptyTitle,
  emptyMessage,
  errorTitle,
  onRetry,
  onEmptyAction,
  emptyActionLabel,
  skeleton,
  children,
}: DataStateProps) {
  if (loading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return <>{children}</>;
}
