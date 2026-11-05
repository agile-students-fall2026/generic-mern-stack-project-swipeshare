export { cn } from "cn";

export const fullNameInitial = (seller) =>
  `${seller.firstName} ${seller.lastInitial}.`;

export const displayPrice = (price) => (price / 100).toFixed(2);
