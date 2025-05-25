import jwt from "jsonwebtoken";

const token = request.headers.get("authorization")?.split(" ")[1];

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Success: decoded.userId can now be used to fetch user-specific data
} catch (err) {
  // Token invalid or expired → return 401 Unauthorized
}
