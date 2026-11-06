import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import MarketList from "../components/MarketList";

const MyListings = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/me/listings");
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
  }, []);

  return (
    <>
      <Header title="My Listings" />
      <main className="p-4 flex flex-col gap-8">
        <MarketList listings={data} basePath="/my-listings" showStatus />
        <Button>
          <Link to="/listings/new">Create Listing</Link>
        </Button>
      </main>
    </>
  );
};

export default MyListings;
