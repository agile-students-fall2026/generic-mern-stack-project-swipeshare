import { Header } from "@/components/Header";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import MarketList from "./MarketList";

const MarketPlace = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/listings");
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
      <Header title="Marketplace" />
      <main className="p-4">
        <MarketList listings={data} />
      </main>
    </>
  );
};

export default MarketPlace;
