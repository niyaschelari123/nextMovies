import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";

const allowedOrigins = [
  "http://localhost:3000",         // for local dev
  "https://your-frontend.com",     // add your deployed frontend domain here
  "https://next-movies-s97f.vercel.app/"
];

function getCORSHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  const headers = getCORSHeaders(origin || "");

  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export async function GET(request) {
  try {
    const origin = request.headers.get("origin");
    const headers = getCORSHeaders(origin || "");

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.toLowerCase();
    const year = searchParams.get("year")?.toLowerCase();

    if (!name || !year) {
      return new NextResponse(
        JSON.stringify({ message: "Missing name or year" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    await connectMongoDB();
    const existing = await Topic.findOne({
      name,
      year: parseInt(year),
    });

    return new NextResponse(
      JSON.stringify({ ...(existing?._doc || {}), exists: !!existing }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/topics/check:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      }
    );
  }
}
