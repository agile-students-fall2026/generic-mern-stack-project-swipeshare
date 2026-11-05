import { locations } from "../../../shared/locations";

const minutesFromNow = (minutes) =>
  new Date(Date.now() + minutes * 60000).toISOString();

const halls = (...names) =>
  names.map((name) => locations.find((l) => l.name === name));

export const listingData = [
  {
    id: "l1",
    fulfillment: "in_person",
    seller: {
      id: "s1",
      firstName: "Jane",
      lastInitial: "S",
      rating: 4.9,
      avatarUrl: "https://picsum.photos/200",
    },
    price: 850,
    paymentMethods: ["venmo", "zelle", "cash"],
    status: "active",
    createdAt: "2026-11-03T01:03:48.899Z",
    diningHalls: halls("Downstein"),
    availableAt: "2026-12-05T01:03:48.899Z",
  },
  {
    id: "l2",
    fulfillment: "in_person",
    seller: {
      id: "s2",
      firstName: "Sherry",
      lastInitial: "T",
      rating: 4.3,
      avatarUrl: "https://picsum.photos/seed/s2/200",
    },
    price: 700,
    paymentMethods: ["venmo", "cash"],
    status: "active",
    createdAt: minutesFromNow(-90),
    diningHalls: halls("Lipton", "Downstein"),
    availableAt: minutesFromNow(25),
  },
  {
    id: "l3",
    fulfillment: "online",
    seller: {
      id: "s3",
      firstName: "Emma",
      lastInitial: "S",
      rating: 4.7,
      avatarUrl: "https://picsum.photos/seed/s3/200",
    },
    price: 900,
    paymentMethods: ["venmo", "zelle", "apple_cash"],
    status: "active",
    createdAt: minutesFromNow(-300),
    windows: [
      { start: minutesFromNow(-30), end: minutesFromNow(90) },
      { start: minutesFromNow(360), end: minutesFromNow(480) },
    ],
    quantity: 5,
  },
  {
    id: "l4",
    fulfillment: "in_person",
    seller: {
      id: "s4",
      firstName: "Noa",
      lastInitial: "J",
      rating: null,
      avatarUrl: "https://picsum.photos/seed/s4/200",
    },
    price: 600,
    paymentMethods: ["zelle", "paypal"],
    status: "active",
    createdAt: minutesFromNow(-15),
    diningHalls: halls("Palladium"),
    availableAt: minutesFromNow(70),
  },
  {
    id: "l5",
    fulfillment: "online",
    seller: {
      id: "s5",
      firstName: "Anan",
      lastInitial: "N",
      rating: 3.6,
      avatarUrl: "https://picsum.photos/seed/s5/200",
    },
    price: 800,
    paymentMethods: ["venmo"],
    status: "active",
    createdAt: minutesFromNow(-1440),
    windows: [{ start: minutesFromNow(180), end: minutesFromNow(300) }],
    quantity: 2,
  },
  {
    id: "l6",
    fulfillment: "in_person",
    seller: {
      id: "s6",
      firstName: "Hanna",
      lastInitial: "T",
      rating: 4.5,
      avatarUrl: "https://picsum.photos/seed/s6/200",
    },
    price: 1000,
    paymentMethods: ["venmo", "zelle", "paypal", "cash", "apple_cash"],
    status: "active",
    createdAt: minutesFromNow(-45),
    diningHalls: halls("Third North", "Palladium", "Upstein"),
    availableAt: minutesFromNow(120),
  },
];
