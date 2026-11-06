import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { displayPrice, fullNameInitial } from "@/lib/utils";
import { Star } from "lucide-react";
import { Link } from "react-router";

const MarketList = ({
  listings,
  basePath = "/listings",
  showStatus = false,
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {listings?.map((listing) => {
          const seller = listing?.seller;
          const price = displayPrice(listing.price);
          const fulfillment =
            listing.fulfillment === "in_person" ? "In Person" : "Online";
          const diningHalls =
            listing.fulfillment === "in_person"
              ? listing.diningHalls.map((h) => h.name).join(", ")
              : "Any GrubHub on-campus dining";

          return (
            <Card key={listing.id} className="relative">
              <Link
                to={`${basePath}/${listing.id}`}
                className="absolute inset-0"
              />
              <CardHeader>
                <CardTitle className="flex flex-row gap-2 mb-2">
                  {showStatus ? (
                    <h2 className="capitalize">{listing.status}</h2>
                  ) : (
                    <>
                      <div className="flex flex-row gap-2 items-center">
                        <img
                          className="rounded-full"
                          src={seller.avatarUrl}
                          width={30}
                          height={30}
                        />
                        <h2>{fullNameInitial(seller)}</h2>
                      </div>
                      <div className="flex flex-row gap-1 items-center text-sm">
                        <Star className="size-4 text-amber-500 fill-amber-400" />{" "}
                        {seller.rating ?? "No Rating"}
                      </div>
                    </>
                  )}
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
