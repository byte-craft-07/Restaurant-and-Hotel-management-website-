import { Component } from "react";
import { Home, RefreshCw, ShieldAlert } from "lucide-react";
import BrandLogo from "./BrandLogo";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Friendly app boundary caught an error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="premium-page flex min-h-screen items-center justify-center p-5">
        <section className="premium-card relative z-10 w-full max-w-xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-orange-50 text-orange-500">
            <ShieldAlert size={38} />
          </div>

          <BrandLogo className="mx-auto mb-6 w-fit justify-center" size="sm" />

          <h1 className="text-3xl font-black text-slate-950">
            We hit a small service bump.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your dining flow is safe. Refresh the experience or return home and
            continue the demo calmly.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="premium-primary-button px-5 py-4"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <a href="/" className="premium-soft-button px-5 py-4">
              <Home size={18} />
              Go home
            </a>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
