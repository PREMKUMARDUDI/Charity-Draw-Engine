import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only cookie for better security (prevents XSS attacks)
  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    // sameSite: "strict", // Prevent CSRF attacks
    secure: false,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
  });

  return token;
};

export default generateToken;
