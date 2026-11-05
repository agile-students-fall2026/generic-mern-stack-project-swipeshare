import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "@/components/ui/toast";
import App from "./App.jsx";
import { AppLayout } from "./components/AppLayout";
import { Header } from "./components/Header";
import NotFound from "./components/NotFound";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import MarketPlace from "./pages/marketplace/MarketPlace";
import SelectUserType from "./pages/SelectUserType.jsx";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_DISABLE_MOCKS) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking()
  .catch(console.error)
  .then(() => {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Replace with your components */}
              <Route path="/" element={<App />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/select-user-type" element={<SelectUserType />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route
                path="/listings/new"
                element={<Header title="Sell a Swipe" />}
              />
              <Route
                path="/listings/:id"
                element={<Header title="Swipe Details" />}
              />
              <Route
                path="/my-listings"
                element={<Header title="My Listings" />}
              />
              <Route
                path="/my-listings/:id"
                element={<Header title="Listing Detail" />}
              />
              <Route
                path="/purchases/:id"
                element={<Header title="Confirmation" showBack={false} />}
              />
              <Route
                path="/purchases/:id/rate"
                element={<Header title="Rating" />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    );
  });
