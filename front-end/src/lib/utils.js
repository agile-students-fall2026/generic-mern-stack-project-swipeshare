import {
  differenceInHours,
  format,
  formatDistanceStrict,
  isToday,
  isTomorrow,
} from "date-fns";

export { cn } from "cn";

export const fullNameInitial = (seller) =>
  `${seller.firstName} ${seller.lastInitial}.`;

export const displayPrice = (price) => (price / 100).toFixed(2);

export const displayTime = (date) => {
  if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "h:mm a")}`;
  return format(date, "MMM d, h:mm a");
};

export const displayWindow = ({ start, end }) =>
  `${displayTime(start)} – ${
    differenceInHours(end, start) < 24
      ? format(end, "h:mm a")
      : displayTime(end)
  }`;

export const fromNow = (date, now) =>
  formatDistanceStrict(date, now, { addSuffix: true });

export const paymentLabels = {
  venmo: "Venmo",
  zelle: "Zelle",
  paypal: "PayPal",
  cash: "Cash",
  apple_cash: "Apple Cash",
};

// ["venmo", "zelle", "cash"] -> "Venmo, Zelle, or Cash"
export const displayPaymentMethods = (methods) =>
  new Intl.ListFormat("en", { type: "disjunction" }).format(
    methods.map((m) => paymentLabels[m]),
  );
