import { useLocation, useNavigate } from "react-router";

export function useGoBack() {
  const navigate = useNavigate();
  const location = useLocation();
  return () => {
    if (location.key === "default") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };
}
