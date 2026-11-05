import { delay, http, HttpResponse } from "msw";
import { locations } from "../../../shared/locations";
import { listingData } from "./data";

export const handlers = [
  http.get("/api/health", async () => {
    await delay();
    return HttpResponse.json({
      status: "ok",
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get("/api/listings", async () => {
    await delay();
    return HttpResponse.json(listingData);
  }),

  http.get("/api/dining-halls", async () => {
    await delay();
    return HttpResponse.json(locations);
  }),
];
