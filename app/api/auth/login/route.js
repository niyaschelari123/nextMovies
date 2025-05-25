import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { username, password } = await req.json();
  await connectMongoDB();
  const user = await User.findOne({ username });

  const allowedOrigins = [
    "http://localhost:3000",
    "https://next-movies-s97f.vercel.app"
  ];

  const origin = req.headers.get("origin");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Credentials": "true"
  };

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers
    });
  }

//   const valid = await bcrypt.compare(password, user.password);
const valid = user.password == password;
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid password" }), {
      status: 401,
      headers
    });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers
  });
}
