import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { username, password } = await req.json();
  await connectDB();
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });
  return Response.json({ user: user.username });
}
