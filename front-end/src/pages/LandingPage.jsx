import { toast } from "@/components/ui/toast";
import { Link, useNavigate } from "react-router";
import googleLogo from "../assets/google-logo.svg";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // The backend login is mocked for now (no real Google sign-in yet),
  // it just sends back a fake token and the mock user
  async function handleGoogleSignIn() {
    try {
      const res = await fetch("/api/auth/login", { method: "POST" });
      if (!res.ok) {
        toast.add({ type: "error", description: "Sign in failed" });
        return;
      }

      const data = await res.json();
      // Save the token so later requests can use it once real login exists
      localStorage.setItem("token", data.token);
      navigate("/select-user-type");
    } catch (e) {
      console.error(e);
      toast.add({ type: "error", description: "Sign in failed" });
    }
  }

  return (
    <main className="landing-page">
      <div className="landing-top">
        <h1 className="landing-title">SwipeShare</h1>
        <p className="landing-tagline">
          Buy and sell meal swipes with other students.
        </p>
      </div>

      <div className="landing-buttons">
        <button
          type="button"
          className="landing-button google-button"
          onClick={handleGoogleSignIn}
        >
          <img className="google-logo" src={googleLogo} alt="" />
          Sign in with Google
        </button>

        <Link to="/how-it-works" className="landing-button how-button">
          See how it works
        </Link>
      </div>
    </main>
  );
}

export default LandingPage;
