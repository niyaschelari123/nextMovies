import connectMongoDB from "@/libs/mongodb";
import Wishlist from "@/models/wishlist";
import { NextResponse } from "next/server";

// Shared CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Replace with your domain in production
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight CORS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// PUT: Update wishlist item by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    await connectMongoDB();
    await Wishlist.findByIdAndUpdate(id, data);

    return new NextResponse(
      JSON.stringify({ message: "Wishlist item updated" }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

// GET: Fetch wishlist item by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectMongoDB();
    const topic = await Wishlist.findOne({ _id: id });

    return new NextResponse(
      JSON.stringify({ topic }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
