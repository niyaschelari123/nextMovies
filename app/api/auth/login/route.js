import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { username, password } = await req.json();
  await connectMongoDB();
  const user = await User.findOne({ username });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

//   const valid = await bcrypt.compare(password, user.password);
const valid = user.password == password
  if (!valid) return Response.json({ error: "Invalid password" }, { status: 401 });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return Response.json({ token });
}
