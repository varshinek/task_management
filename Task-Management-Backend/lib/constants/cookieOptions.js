const cookieOptions = {
  httpOnly: true, // Prevents client-side JS access
  secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
  sameSite: "Lax", // Helps prevent CSRF attacks while allowing third-party embeds
  maxAge: 86400000, // 1 day in milliseconds
  path: "/", // Makes cookie available across entire domain
};

export { cookieOptions };
