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
    windows: [
      { start: "2026-12-05T01:03:48.899Z", end: "2026-12-05T03:03:48.899Z" },
    ],
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
    windows: [{ start: minutesFromNow(-20), end: minutesFromNow(40) }],
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
    windows: [{ start: minutesFromNow(70), end: minutesFromNow(130) }],
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
    windows: [
      { start: minutesFromNow(120), end: minutesFromNow(180) },
      { start: minutesFromNow(1500), end: minutesFromNow(1620) },
    ],
  },
];

export const currentUser = {
  id: "u1",
  firstName: "Alex",
  lastInitial: "K",
  rating: 4.6,
  avatarUrl: "https://picsum.photos/seed/u1/200",
};

export const phones = {
  u1: "212-555-0100",
  s1: "212-555-0101",
  s2: "212-555-0102",
  s3: "212-555-0103",
  s4: "212-555-0104",
  s5: "212-555-0105",
  s6: "212-555-0106",
};

export const paymentInfo = {
  s1: "Venmo @jane-s · Zelle 212-555-0101",
  s2: "Venmo @sherry-t",
  s3: "Venmo @emma-s · Zelle emma@example.com · Apple Cash 212-555-0103",
  s4: "Zelle 212-555-0104 · PayPal noa@example.com",
  s5: "Venmo @anan-n",
  s6: null,
};

listingData.push({
  id: "l7",
  fulfillment: "in_person",
  seller: currentUser,
  price: 900,
  paymentMethods: ["venmo", "cash"],
  status: "sold",
  createdAt: minutesFromNow(-120),
  diningHalls: halls("Lipton"),
  windows: [{ start: minutesFromNow(30), end: minutesFromNow(90) }],
});

export const purchaseData = [
  {
    id: "p1",
    listingId: "l7",
    fulfillment: "in_person",
    seller: { ...currentUser, phone: phones.u1 },
    buyer: {
      ...listingData.find((l) => l.id === "l2").seller,
      phone: phones.s2,
    },
    price: 900,
    paymentMethods: ["venmo", "cash"],
    paymentInfo: null,
    diningHall: halls("Lipton")[0],
    meetAt: minutesFromNow(45),
    orderNumber: null,
    status: "pending",
    createdAt: minutesFromNow(-10),
  },
];
