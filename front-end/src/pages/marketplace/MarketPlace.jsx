import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import MarketList from "./MarketList";

const MarketPlace = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      await fetch("/api/listings")
        .then((res) => res.json())
        .then(setData)
        .catch(console.error);
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
