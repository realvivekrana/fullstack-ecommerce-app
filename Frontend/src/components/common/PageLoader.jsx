/**
 * Full-page loading indicator shown by React.Suspense while a lazy chunk loads.
 *
 * Accessibility:
 * - role="status" creates a live region so screen readers announce "Loading…"
 *   without the user needing to find the element.
 * - aria-label provides a human-readable name for the live region.
 * - The spinner is aria-hidden so it isn't read out; the sr-only text carries
 *   the accessible description.
 */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
    >
      {/* Visible spinner */}
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[var(--color-primary)] animate-spin"
      />
      {/* Screen-reader text */}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default PageLoader;
