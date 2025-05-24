import connectMongoDB from "@/libs/mongodb";
import Wishlist from "@/models/wishlist";
import { NextResponse } from "next/server";

// Allowed domains
const allowedOrigins = [
  "http://localhost:3000",
  "https://next-movies-s97f.vercel.app",
];

// Utility to get CORS headers based on origin
function getCORSHeaders(origin = "") {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Handle preflight
export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  const headers = getCORSHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    const data = await request.json();
    console.log("Data received:", data);

    await connectMongoDB();
    await Wishlist.create(data);

    return new NextResponse(
      JSON.stringify({ message: "Added Show to Wishlist" }),
      {
        status: 201,
        headers,
      }
    );
  } catch (error) {
    console.error("Error creating wishlist:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}

export async function GET(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  await connectMongoDB();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let topics;
  if (type) {
    topics = await Wishlist.find({ type });
  } else {
    topics = await Wishlist.find();
  }

  return new NextResponse(
    JSON.stringify({ topics }),
    { status: 200, headers }
  );
}

export async function DELETE(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Wishlist.findByIdAndDelete(id);

  return new NextResponse(
    JSON.stringify({ message: "Data deleted" }),
    { status: 200, headers }
  );
}
