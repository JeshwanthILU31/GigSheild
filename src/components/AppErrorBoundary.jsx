import React from 'react';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Route render failed:', error, errorInfo);
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false, error: null });
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
                    <div className="max-w-xl w-full rounded-3xl border border-slate-200 bg-white shadow-xl p-8 text-center">
                        <p className="text-[11px] font-black tracking-[0.3em] uppercase text-rose-500 mb-3">
                            Dashboard Error
                        </p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                            We hit a rendering issue.
                        </h2>
                        <p className="text-sm text-slate-500 mb-8">
                            The page could not be displayed safely. You can retry this screen or return to the dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.assign('/dashboard')}
                                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm"
                            >
                                Go to Dashboard
                            </button>
                        </div>

                        {this.state.error?.message && (
                            <p className="mt-6 text-xs text-slate-400 break-words">
                                {this.state.error.message}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
