import { Header } from "@/components/Header";
import { toast } from "@/components/ui/toast";
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
  console.log(data);
  return (
    <>
      <Header title="Swipe Details" />
      <main className="p-4">
        <div>{data?.id}</div>
      </main>
    </>
  );
};

export default SwipeDetail;
