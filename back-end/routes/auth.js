import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { currentUser } from "../data.js";

const router = express.Router();
const googleClient = new OAuth2Client();

// The frontend sends us the token it got from Google's sign in button.
// We check it with Google, then send back our own JWT. We don't check for
// NYU emails here because our Google project is "Internal" to nyu.edu,
// so Google already blocks everyone else. Users aren't saved yet since we
// don't have a database.
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
