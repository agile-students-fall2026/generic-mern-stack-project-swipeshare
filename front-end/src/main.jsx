import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>,
    );
  });
