import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { displayPrice, fullNameInitial } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const SwipeDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) {
          toast.add({
            type: "error",
            description: (await res.json())?.message,
          });
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        toast.add({
          type: "error",
          description: e.message,
        });
      }
    }
    fetchData();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Header title="Swipe Details" />
      <main className="p-4">
        <div className="flex justify-center items-center flex-col gap-8">
          <img
            className="w-full max-w-80 aspect-square object-cover rounded-full"
            src={data?.seller.avatarUrl}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-row gap-2">
            <h2 className="text-2xl font-medium">
              {fullNameInitial(data.seller)}
            </h2>
            <div className="flex flex-row gap-1 items-center">
              <Star className="size-4 text-lg text-amber-500 fill-amber-400" />{" "}
              {data.seller.rating ?? "No Rating"}
            </div>
          </div>
          <h1 className="text-6xl font-medium">${displayPrice(data.price)}</h1>
          <Button size="lg">Purchase This Swipe</Button>
          <div className="flex flex-col gap-1 items-center justify-center">
            <p className="text-md font-medium">Supported Payment Methods</p>
            <p>{data.paymentMethods.join(", ")}</p>
          </div>
          <p className="text-md px-2 text-center text-neutral-800">
            {data.fulfillment === "in_person"
              ? "You will be meeting the seller on-site at the dining hall."
              : "The seller will place a Grubhub pickup order for you."}{" "}
            Contact the seller after purchase to discuss details.
          </p>
        </div>
      </main>
    </>
  );
};

export default SwipeDetail;
