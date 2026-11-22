import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { currentUser } from "../data.js";

const router = express.Router();
const googleClient = new OAuth2Client();

// Only NYU students can use SwipeShare. We check the end of the email
// (with the @) so things like "someone@notnyu.edu" don't get through.
export function isNyuEmail(email) {
  if (typeof email !== "string") {
    return false;
  }
  return email.toLowerCase().endsWith("@nyu.edu");
}

// The frontend sends us the token it got from Google's sign in button.
// We check it with Google, make sure it's an NYU email, then send back
// our own JWT. Users aren't saved yet since we don't have a database.
router.post("/api/auth/login", async (req, res) => {
  const credential = req.body?.credential;
  if (!credential) {
    return res.status(400).json({ message: "Missing Google credential" });
  }

  let profile;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    profile = ticket.getPayload();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Google sign in failed" });
  }

  if (!profile.email_verified || !isNyuEmail(profile.email)) {
    return res
      .status(403)
      .json({ message: "Please sign in with a NYU email" });
  }

  const user = {
    id: profile.sub,
    firstName: profile.given_name,
    lastInitial: profile.family_name ? profile.family_name[0] : "",
    email: profile.email,
    avatarUrl: profile.picture,
    rating: null,
  };

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user });
});

// Still mocked: always the same user. Once the other routes use real
// users, this will read the JWT from the request to know who is asking.
router.get("/api/me", (req, res) => {
  res.json(currentUser);
});

export default router;
