import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  displayPaymentMethods,
  displayPrice,
  displayTime,
  fullNameInitial,
} from "@/lib/utils";
import { Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import TimeSlots from "../marketplace/TimeSlots";

const SaleFlow = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const listingRes = await fetch(`/api/listings/${id}`);
        if (!listingRes.ok) throw new Error((await listingRes.json())?.message);
        const purchasesRes = await fetch(`/api/listings/${id}/purchases`);
        if (!purchasesRes.ok)
          throw new Error((await purchasesRes.json())?.message);
        setListing(await listingRes.json());
        setPurchases(await purchasesRes.json());
      } catch (e) {
        toast.add({ type: "error", description: e.message });
      }
    }
    fetchData();
  }, [id]);

  // action is "complete" or "cancel"
  async function updatePurchase(purchase, action) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/purchases/${purchase.id}/${action}`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message);
      setPurchases((prev) => prev.map((p) => (p.id === json.id ? json : p)));
      if (action === "cancel") {
        const listingRes = await fetch(`/api/listings/${id}`);
        if (listingRes.ok) setListing(await listingRes.json());
      }
    } catch (e) {
      toast.add({ type: "error", description: e.message });
    } finally {
      setUpdating(false);
    }
  }

  if (!listing) {
    return (
      <>
        <Header title="Listing Detail" />
        <p className="p-4">Loading...</p>
      </>
    );
  }

  const sales = purchases.filter((p) => p.status !== "cancelled");
  const onMarket = listing.status === "active";

  return (
    <>
      <Header title="Listing Detail" />
      <main className="p-4 flex flex-col gap-12">
        {(sales.length === 0 || onMarket) && (
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-6xl font-medium">
              ${displayPrice(listing.price)}
            </h1>
            {listing.fulfillment === "in_person" && (
              <p className="text-2xl font-medium text-center">
                {listing.diningHalls.map((h) => h.name).join(", ")}
              </p>
            )}
            <TimeSlots listing={listing} />
            {sales.length === 0 && (
              <p className="text-muted-foreground">Waiting for a buyer</p>
            )}
          </div>
        )}

        {sales.map((sale) => (
          <section key={sale.id} className="flex flex-col items-center gap-6">
            <img
              className="w-full max-w-64 aspect-square object-cover rounded-full bg-muted"
              src={sale.buyer.avatarUrl}
              alt={fullNameInitial(sale.buyer)}
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-4xl font-medium">
                  {fullNameInitial(sale.buyer)}
                </h2>
                <span className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-sm text-muted-foreground">
                  <Star className="size-3.5 text-amber-500 fill-amber-400" />
                  {sale.buyer.rating ?? "No Rating"}
                </span>
              </div>
              <p className="text-lg">Purchased this Swipe</p>
              <p className="text-sm text-muted-foreground text-center">
                {sale.fulfillment === "in_person"
                  ? `Meet at ${sale.diningHall.name}, ${displayTime(new Date(sale.meetAt))}`
                  : "Place a Grubhub pickup order for them, then text them the order number."}
              </p>
            </div>
            <h1 className="text-6xl font-medium">
              ${displayPrice(sale.price)}
            </h1>

            {sale.status === "pending" ? (
              <div className="w-full flex flex-col gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 text-base"
                  nativeButton={false}
                  render={<a href={`tel:${sale.buyer.phone}`} />}
                >
                  <Phone /> Call Buyer
                </Button>
                <Button
                  size="lg"
                  className="h-12 text-base"
                  disabled={updating}
                  onClick={() => updatePurchase(sale, "complete")}
                >
                  {updating ? "Updating..." : "Mark as Complete"}
                </Button>
              </div>
            ) : (
              <p className="font-medium text-primary">Sale completed</p>
            )}

            <p className="text-center">
              Payment via {displayPaymentMethods(sale.paymentMethods)}
            </p>
            {sale.status === "pending" && (
              <Button
                variant="ghost"
                disabled={updating}
                onClick={() => updatePurchase(sale, "cancel")}
              >
                Cancel Sale
              </Button>
            )}
          </section>
        ))}
      </main>
    </>
  );
};

export default SaleFlow;
