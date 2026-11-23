import { toast } from "@/components/ui/toast";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Google gives us a token after the user picks their account.
  // We send it to our backend, which checks it with Google and sends
  // back our own token (a JWT).
  async function handleGoogleSuccess(credentialResponse) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      if (!res.ok) {
        // Show the backend's message, e.g. "Google sign in failed"
        const error = await res.json();
        toast.add({
          type: "error",
          description: error?.message || "Sign in failed",
        });
        return;
      }

      const data = await res.json();
      // Save the token so later requests can prove who the user is
      localStorage.setItem("token", data.token);
      navigate("/select-user-type");
    } catch (e) {
      console.error(e);
      toast.add({ type: "error", description: "Sign in failed" });
    }
  }

  function handleGoogleError() {
    toast.add({ type: "error", description: "Google sign in failed" });
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
        {/* Google draws this button itself, so our CSS can't restyle it.
            hosted_domain makes Google suggest NYU accounts first. Google
            already blocks non-NYU accounts since our project is Internal. */}
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            hosted_domain="nyu.edu"
            text="signin_with"
            shape="pill"
            size="large"
            width={320}
          />
        </div>

        <Link to="/how-it-works" className="landing-button how-button">
          See how it works
        </Link>
      </div>
    </main>
  );
}

export default LandingPage;
