import { useGoBack } from "@/lib/navigations";
import { Header } from "./Header";
import { Button } from "./ui/button";

export default function NotFound() {
  const goBack = useGoBack();
  return (
    <>
      <Header title="Not Found" />
      <div className="flex justify-center items-center flex-1">
        <Button size="lg" onClick={goBack}>
          Go Back
        </Button>
      </div>
    </>
  );
}
