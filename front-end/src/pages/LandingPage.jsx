import { Link, useNavigate } from "react-router";
import googleLogo from "../assets/google-logo.svg";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Mocked for Sprint 1: real Google sign-in comes with the backend,
  // so for now we just go to the next screen
  function handleGoogleSignIn() {
    navigate("/select-user-type");
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
