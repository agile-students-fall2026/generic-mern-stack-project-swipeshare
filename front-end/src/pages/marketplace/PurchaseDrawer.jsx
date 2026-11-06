import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { displayPrice, displayWindow, fullNameInitial } from "@/lib/utils";
import { addMinutes, format, roundToNearestMinutes } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { HallOption } from "./DiningHallFilter";

const meetTimeGroups = (windows, now) =>
  windows
    .map((w) => {
      const start = new Date(w.start);
      const end = new Date(w.end);
      const times = [];
      let t = roundToNearestMinutes(start > now ? start : now, {
        nearestTo: 15,
        roundingMethod: "ceil",
      });
      for (; t < end; t = addMinutes(t, 15)) times.push(t);
      return { start, end, times };
    })
    .filter((g) => g.times.length > 0)
    .sort((a, b) => a.start - b.start);

const unavailableReason = (listing, groups, now) => {
  if (listing.status !== "active") return "No longer available";
  if (listing.fulfillment === "in_person") {
    return groups.length === 0 ? "No upcoming times" : null;
  }
  const open = listing.windows.some(
    (w) => new Date(w.start) <= now && now < new Date(w.end),
  );
  return open ? null : "The seller isn't taking orders right now";
};

const PurchaseDrawer = ({ listing }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hallId, setHallId] = useState(
    listing.fulfillment === "in_person" && listing.diningHalls.length === 1
      ? listing.diningHalls[0].id
      : null,
  );
  const [meetAt, setMeetAt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const inPerson = listing.fulfillment === "in_person";
  const now = new Date();
  const groups = inPerson ? meetTimeGroups(listing.windows, now) : [];
  const reason = unavailableReason(listing, groups, now);
  const price = `$${displayPrice(listing.price)}`;
  const ready = !inPerson || (hallId && meetAt);

  async function purchase() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          diningHallId: hallId ?? undefined,
          meetAt: meetAt ?? undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message);
      navigate(`/purchases/${json.id}`);
    } catch (e) {
      toast.add({ type: "error", description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger render={<Button size="lg" disabled={Boolean(reason)} />}>
          Purchase This Swipe
        </DrawerTrigger>
        <DrawerContent className="mx-auto max-w-md">
          <DrawerHeader className="pb-3">
            <DrawerTitle className="text-lg">Purchase Swipe</DrawerTitle>
            <DrawerDescription>
              {fullNameInitial(listing.seller)} · {price}
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto border-t">
            {!inPerson && (
              <p className="px-4 py-6 text-center text-muted-foreground">
                After you confirm, text the seller what you&apos;d like to eat.
                They&apos;ll place the Grubhub order for you.
              </p>
            )}
            {inPerson && (
              <h3 className="px-4 pt-4 pb-1 text-sm font-medium text-muted-foreground">
                Dining Hall
              </h3>
            )}
            {inPerson &&
              listing.diningHalls.map((hall) => (
                <HallOption
                  key={hall.id}
                  name={hall.name}
                  address={[hall.street, hall.detail]
                    .filter(Boolean)
                    .join(" · ")}
                  image={hall.image}
                  selected={hallId === hall.id}
                  onSelect={() => setHallId(hall.id)}
                />
              ))}
            {inPerson && (
              <>
                <h3 className="px-4 pt-4 pb-1 text-sm font-medium text-muted-foreground">
                  Meet At
                </h3>
                {groups.map((g) => (
                  <div key={g.start.getTime()} className="px-4 pb-3">
                    <p className="pb-2 text-xs text-muted-foreground">
                      {displayWindow(g)}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {g.times.map((t) => {
                        const iso = t.toISOString();
                        return (
                          <button
                            key={iso}
                            type="button"
                            data-selected={meetAt === iso || undefined}
                            onClick={() => setMeetAt(iso)}
                            className="h-10 rounded-lg text-sm ring-1 ring-foreground/10 transition-colors active:bg-muted data-selected:bg-primary data-selected:text-primary-foreground data-selected:ring-primary"
                          >
                            {format(t, "h:mm a")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <DrawerFooter className="border-t pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button
              size="lg"
              className="h-12 w-full text-base"
              disabled={!ready || submitting}
              onClick={purchase}
            >
              {submitting ? "Purchasing..." : `Confirm · ${price}`}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
    </div>
  );
};

export default PurchaseDrawer;
