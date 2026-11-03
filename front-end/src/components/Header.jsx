import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export const Header = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = () => {
    if (location.key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-background px-2">
        {showBack && (
          <Button variant="ghost" size="icon-lg" onClick={goBack}>
            <ArrowLeft />
          </Button>
        )}
        <h1 className="col-start-2 text-center text-lg font-medium">{title}</h1>
      </header>
    </>
  );
};
