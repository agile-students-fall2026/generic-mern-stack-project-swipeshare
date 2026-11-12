import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "@/components/ui/toast";
import App from "./App.jsx";
import { AppLayout } from "./components/AppLayout";
import NotFound from "./components/NotFound";
import BuyerConfirmationPage from "./pages/BuyerConfirmationPage";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import MarketPlace from "./pages/marketplace/MarketPlace";
import SwipeDetail from "./pages/marketplace/SwipeDetail";
import MyListings from "./pages/MyListings.jsx";
import RatingPage from "./pages/RatingPage";
import SelectUserType from "./pages/SelectUserType.jsx";
import CreateListing from "./pages/selling/CreateListing";
import SaleFlow from "./pages/selling/SaleFlow";

async function enableMocking() {
  if (!import.meta.env.DEV || !import.meta.env.VITE_ENABLE_MOCKS) {
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
              <Route path="/listings/new" element={<CreateListing />} />
              <Route path="/listings/:id" element={<SwipeDetail />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/my-listings/:id" element={<SaleFlow />} />
              <Route
                path="/purchases/:id"
                element={<BuyerConfirmationPage />}
              />
              <Route path="/purchases/:id/rate" element={<RatingPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    );
  });
