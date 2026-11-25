import { useLocation, useNavigate } from "react-router";

export function useGoBack(fallback = "/") {
  const navigate = useNavigate();
  const location = useLocation();
  return () => {
    if (location.key === "default") {
      navigate(fallback, { replace: true });
    } else {
      navigate(-1);
    }
  };
}
