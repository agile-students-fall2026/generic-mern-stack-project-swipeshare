import { useNavigate } from "react-router";

export function useGoBack(fallback = "/") {
  const navigate = useNavigate();
  return () => {
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };
}
