import { Component } from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * ErrorBoundary — React error boundary wrapper.
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the whole app.
 *
 * Props:
 * - children: React children
 * - fallback: Optional custom fallback component (defaults to ErrorFallback)
 * - onError: Optional callback for error reporting (e.g., Sentry, analytics)
 */

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary] Caught error:', error);
            console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
        }

        // Call optional error reporting callback
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-[400px] p-6">
                    <ErrorFallback
                        error={this.state.error}
                        resetErrorBoundary={this.handleReset}
                        message={this.props.message}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;