import { Header } from "@/components/Header";
import MarketList from "@/components/MarketList";
import { toast } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import ListFilters from "./ListFilters";

const MarketPlace = () => {
  const [data, setData] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.toString();

  const setFilter = (k, v) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v) {
          next.set(k, v);
        } else {
          next.delete(k);
        }
        return next;
      },
      { replace: true },
    );

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/listings?${query}`);
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
  }, [query]);

  return (
    <>
      <Header title="Marketplace" />
      <main className="p-4 flex flex-col gap-2">
        <ListFilters
          filters={Object.fromEntries(searchParams)}
          onFilter={setFilter}
        />
        <MarketList listings={data} />
      </main>
    </>
  );
};

export default MarketPlace;
