import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/premiumHover.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import PremiumHoverProvider from "./components/motion/PremiumHoverProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <PremiumHoverProvider>
            <App />
          </PremiumHoverProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
