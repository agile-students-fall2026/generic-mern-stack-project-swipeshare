import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { displayTime, paymentLabels } from "@/lib/utils";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HallOption } from "../marketplace/DiningHallFilter";

const fulfillmentLabels = {
  in_person: "In Person",
  online: "Grubhub Order",
};

const durations = [
  { minutes: 30, label: "30 minutes" },
  { minutes: 60, label: "1 hour" },
  { minutes: 120, label: "2 hours" },
  { minutes: 180, label: "3 hours" },
];

// Adds the item if it's missing, removes it if it's there
const toggle = (list, item) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

const CreateListing = () => {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [hallsOpen, setHallsOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState("in_person");
  const [price, setPrice] = useState("");
  const [hallIds, setHallIds] = useState([]);
  // Next half hour
  const [start, setStart] = useState(() =>
    roundToNearestMinutes(new Date(), {
      nearestTo: 30,
      roundingMethod: "ceil",
    }),
  );
  const [duration, setDuration] = useState(60);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [quantity, setQuantity] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchHalls() {
      try {
        const res = await fetch("/api/dining-halls");
        if (!res.ok) throw new Error((await res.json())?.message);
        setHalls(await res.json());
      } catch (e) {
        toast.add({ type: "error", description: e.message });
      }
    }
    fetchHalls();
  }, []);

  const inPerson = fulfillment === "in_person";
  const methods = Object.keys(paymentLabels).filter(
    (m) => inPerson || m !== "cash",
  );
  const selectedHalls = halls.filter((h) => hallIds.includes(h.id));
  const ready =
    price && paymentMethods.length > 0 && (!inPerson || hallIds.length > 0);

  function selectFulfillment(value) {
    setFulfillment(value);
    if (value === "online") {
      setPaymentMethods(paymentMethods.filter((m) => m !== "cash"));
    }
  }

  async function submit(event) {
    event.preventDefault();
    const end = addMinutes(start, duration);
    if (end <= new Date()) {
      toast.add({ type: "error", description: "Pick a time in the future" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillment,
          price: Math.round(Number(price) * 100),
          paymentMethods,
          windows: [{ start: start.toISOString(), end: end.toISOString() }],
          diningHallIds: inPerson ? hallIds : undefined,
          quantity: inPerson ? undefined : Number(quantity),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message);
      navigate(`/my-listings/${json.id}`, { replace: true });
    } catch (e) {
      toast.add({ type: "error", description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header title="Sell a Swipe" />
      <form onSubmit={submit} className="p-4 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <label htmlFor="price" className="text-2xl font-medium">
            Sale Price
          </label>
          <div className="flex items-center text-6xl font-medium">
            $
            <input
              id="price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: `${Math.max(price.length, 4)}ch` }}
              className="max-w-72 bg-transparent outline-none border-b-2 border-transparent focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.keys(fulfillmentLabels).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={fulfillment === value}
              data-selected={fulfillment === value || undefined}
              onClick={() => selectFulfillment(value)}
              className="h-10 rounded-lg px-2 text-sm ring-1 ring-foreground/10 transition-colors active:bg-muted data-selected:bg-primary data-selected:text-primary-foreground data-selected:ring-primary"
            >
              {fulfillmentLabels[value]}
            </button>
          ))}
        </div>

        {inPerson && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-lg font-medium">Dining Hall</p>
            <Drawer
              open={hallsOpen}
              onOpenChange={setHallsOpen}
              showSwipeHandle
            >
              <DrawerTrigger
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-12 w-full justify-between text-base"
                  />
                }
              >
                <span className="min-w-0 truncate">
                  {selectedHalls.length > 0
                    ? selectedHalls.map((h) => h.name).join(", ")
                    : "Choose dining halls"}
                </span>
                <ChevronDown />
              </DrawerTrigger>
              <DrawerContent className="mx-auto max-w-md">
                <DrawerHeader className="pb-3">
                  <DrawerTitle className="text-lg">Dining Halls</DrawerTitle>
                </DrawerHeader>
                <div className="min-h-0 flex-1 overflow-y-auto border-t">
                  {halls.map((hall) => (
                    <HallOption
                      key={hall.id}
                      name={hall.name}
                      address={[hall.street, hall.detail]
                        .filter(Boolean)
                        .join(" · ")}
                      image={hall.image}
                      selected={hallIds.includes(hall.id)}
                      onSelect={() => setHallIds(toggle(hallIds, hall.id))}
                    />
                  ))}
                </div>
                <DrawerFooter className="border-t pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <Button
                    type="button"
                    size="lg"
                    className="h-12 w-full text-base"
                    onClick={() => setHallsOpen(false)}
                  >
                    Done
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-center text-lg font-medium">Date/Time</p>
          <div className="relative">
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-full justify-between text-base"
            >
              <span>{displayTime(start)}</span>
              <ChevronDown />
            </Button>
            <input
              id="start"
              type="datetime-local"
              aria-label="Start time"
              className="absolute inset-0 opacity-0"
              value={format(start, "yyyy-MM-dd'T'HH:mm")}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onChange={(e) => {
                if (e.target.value) setStart(new Date(e.target.value));
              }}
            />
          </div>
          <div className="relative">
            <select
              id="duration"
              aria-label="Available for"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="h-12 w-full appearance-none rounded-lg bg-secondary px-2.5 text-base font-medium text-secondary-foreground"
            >
              {durations.map((d) => (
                <option key={d.minutes} value={d.minutes}>
                  Available for {d.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-4 right-2.5 size-4" />
          </div>
        </div>

        {!inPerson && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="quantity"
              className="text-center text-lg font-medium"
            >
              Swipes for Sale
            </label>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-12 rounded-lg bg-secondary px-2.5 text-base font-medium text-secondary-foreground"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-center text-lg font-medium">Payment Methods</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((method) => (
              <button
                key={method}
                type="button"
                aria-pressed={paymentMethods.includes(method)}
                data-selected={paymentMethods.includes(method) || undefined}
                onClick={() =>
                  setPaymentMethods(toggle(paymentMethods, method))
                }
                className="h-10 rounded-lg px-2 text-sm ring-1 ring-foreground/10 transition-colors active:bg-muted data-selected:bg-primary data-selected:text-primary-foreground data-selected:ring-primary"
              >
                {paymentLabels[method]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full text-base"
            disabled={!ready || submitting}
          >
            {submitting ? "Listing..." : "List for Sale"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            We'll let you know if a buyer purchases your swipe, or if your
            listing expires.
          </p>
        </div>
      </form>
    </>
  );
};

export default CreateListing;
