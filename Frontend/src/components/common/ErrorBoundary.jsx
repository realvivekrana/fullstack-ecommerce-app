import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Top-level error boundary.
 *
 * Catches JavaScript errors anywhere in the tree and renders a graceful
 * fallback instead of a blank screen.
 *
 * Extend `componentDidCatch` to send errors to a monitoring service
 * (e.g. Sentry.captureException) when one is added.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message ?? 'Unknown error',
    };
  }

  componentDidCatch(error, info) {
    // Replace with your error-reporting service:
    // reportToSentry(error, { componentStack: info.componentStack });
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={36} className="text-red-400" aria-hidden="true" />
        </div>

        {/* Copy */}
        <div className="space-y-2 max-w-sm">
          <h1 className="text-[22px] font-bold text-gray-900">Something went wrong</h1>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            An unexpected error occurred. Try refreshing the page — if the problem
            persists, please contact support.
          </p>
          {/* Show technical detail in development only */}
          {import.meta.env.DEV && this.state.errorMessage && (
            <p className="mt-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200
              text-[12px] font-mono text-gray-600 text-left break-all">
              {this.state.errorMessage}
            </p>
          )}
        </div>

        {/* Action */}
        <button
          onClick={this.handleReset}
          className="inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-[var(--color-primary)] text-white text-[14px] font-semibold
            hover:bg-[var(--color-primary-dark)]
            active:scale-[0.97]
            transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Return to Home
        </button>
      </main>
    );
  }
}

export default ErrorBoundary;
