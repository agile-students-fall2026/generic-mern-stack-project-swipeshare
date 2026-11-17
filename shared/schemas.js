import { z } from "zod";
import { locations } from "./locations.js";

const id = z.string().min(1);
const dateTime = z.iso.datetime("Times must be ISO date-times");
const cents = z.number().int().min(0);

export const fulfillments = ["in_person", "online"];
export const paymentMethods = [
  "venmo",
  "zelle",
  "paypal",
  "cash",
  "apple_cash",
];
export const listingStatuses = ["active", "sold", "expired"];
export const purchaseStatuses = ["pending", "completed", "cancelled"];

const diningHallIds = new Set(locations.map((l) => l.id));

export const userSummarySchema = z.object({
  id,
  firstName: z.string().min(1),
  lastInitial: z.string().length(1),
  rating: z.number().min(0).max(5).nullable(),
  avatarUrl: z.url().optional(),
});

export const diningHallSchema = z.object({
  id,
  name: z.string().min(1),
  street: z.string(),
  detail: z.string().nullable(),
  city: z.string(),
  zip: z.string(),
  lat: z.number(),
  lon: z.number(),
  image: z.url(),
});

export const timeWindowSchema = z
  .object({ start: dateTime, end: dateTime })
  .refine((w) => new Date(w.end) > new Date(w.start), {
    message: "End time must be after start time",
    path: ["end"],
  });

const paymentMethodsSchema = z
  .array(
    z.enum(paymentMethods, "Unknown payment method"),
    "Pick at least one payment method",
  )
  .min(1, "Pick at least one payment method")
  .refine((methods) => new Set(methods).size === methods.length, {
    message: "Payment methods must not repeat",
  });

const onlinePaymentMethodsSchema = paymentMethodsSchema.refine(
  (methods) => !methods.includes("cash"),
  { message: "Online listings can't take cash" },
);

const windowsSchema = z
  .array(timeWindowSchema, "Pick a time window")
  .min(1, "Pick a time window");

const listingBase = {
  id,
  seller: userSummarySchema,
  price: cents,
  paymentMethods: paymentMethodsSchema,
  windows: windowsSchema,
  status: z.enum(listingStatuses),
  createdAt: dateTime,
};

export const inPersonListingSchema = z.object({
  ...listingBase,
  fulfillment: z.literal("in_person"),
  diningHalls: z.array(diningHallSchema).min(1),
});

export const onlineListingSchema = z.object({
  ...listingBase,
  fulfillment: z.literal("online"),
  paymentMethods: onlinePaymentMethodsSchema,
  quantity: z.number().int().min(0),
});

export const listingSchema = z.discriminatedUnion("fulfillment", [
  inPersonListingSchema,
  onlineListingSchema,
]);

const createListingBase = {
  price: z
    .number("Price is required")
    .int("Price must be in whole cents")
    .min(1, "Price must be more than $0"),
  paymentMethods: paymentMethodsSchema,
  windows: windowsSchema.refine(
    (windows) => windows.some((w) => new Date(w.end) > new Date()),
    { message: "Pick a time in the future" },
  ),
};

export const createListingSchema = z.discriminatedUnion(
  "fulfillment",
  [
    z.object({
      ...createListingBase,
      fulfillment: z.literal("in_person"),
      diningHallIds: z
        .array(
          z.string().refine((hallId) => diningHallIds.has(hallId), {
            message: "Dining hall not found",
          }),
          "Pick at least one dining hall",
        )
        .min(1, "Pick at least one dining hall")
        .refine((ids) => new Set(ids).size === ids.length, {
          message: "Dining halls must not repeat",
        }),
    }),
    z.object({
      ...createListingBase,
      fulfillment: z.literal("online"),
      paymentMethods: onlinePaymentMethodsSchema,
      quantity: z
        .number("Quantity is required")
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1"),
    }),
  ],
  {
    error: (issue) =>
      issue.code === "invalid_type"
        ? "Request body must be a JSON object"
        : "Pick in-person or online",
  },
);

export const purchaseUserSchema = userSummarySchema.extend({
  phone: z.string().min(1),
});

export const purchaseSchema = z.object({
  id,
  listingId: id,
  fulfillment: z.enum(fulfillments),
  seller: purchaseUserSchema,
  buyer: purchaseUserSchema,
  price: cents,
  paymentMethods: z.array(z.enum(paymentMethods)),
  paymentInfo: z.string().nullable(),
  diningHall: diningHallSchema.nullable(),
  meetAt: dateTime.nullable(),
  status: z.enum(purchaseStatuses),
  createdAt: dateTime,
});

export const createPurchaseSchema = z.object({
  listingId: id,
  diningHallId: id.optional(),
  meetAt: dateTime.optional(),
});

export const createReviewSchema = z.object({
  purchaseId: id,
  rating: z.number().int().min(-1).max(10),
  comment: z.string().optional(),
});

export function errorMessage(error) {
  return error.issues[0]?.message ?? "Invalid request";
}
