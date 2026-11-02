import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const Header = ({ title }) => {
  const navigate = useNavigate();
  return (
    <>
      <header className="sticky top-0 z-10 grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-background px-2">
        <Button variant="ghost" size="icon-lg" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-center text-lg font-medium">{title}</h1>
      </header>
    </>
  );
};
