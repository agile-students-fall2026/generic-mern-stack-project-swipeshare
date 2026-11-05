import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router";

const MarketList = ({ listings }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {listings?.map((listing) => {
          const seller = listing?.seller;
          const price = (listing.price / 100).toFixed(2);
          const fulfillment =
            listing.fulfillment === "in_person" ? "In Person" : "Online";
          const diningHalls =
            listing.fulfillment === "in_person"
              ? listing.diningHalls.map((h) => h.name).join(", ")
              : "Any GrubHub on-campus dining";

          return (
            <Card key={listing.id} className="relative">
              <Link
                to={`/listings/${listing.id}`}
                className="absolute inset-0"
              />
              <CardHeader>
                <CardTitle className="flex flex-row gap-2 mb-2">
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      className="rounded-full"
                      src={seller.avatarUrl}
                      width={30}
                      height={30}
                    />
                    <h2>
                      {seller.firstName} {seller.lastInitial}.
                    </h2>
                  </div>
                  <div className="flex flex-row gap-1 items-center text-sm">
                    <Star className="size-4 text-amber-500 fill-amber-400" />{" "}
                    {seller.rating ?? "No Rating"}
                  </div>
                </CardTitle>
                <CardDescription>{fulfillment}</CardDescription>
                <CardAction className="flex flex-row gap-1 items-center text-lg">
                  ${price}
                </CardAction>
              </CardHeader>
              <CardContent>
                <p>{diningHalls}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default MarketList;
