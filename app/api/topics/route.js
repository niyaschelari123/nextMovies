import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

// Allowed origins
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://next-movies-s97f.vercel.app",
];

// Generate CORS headers dynamically
function getCORSHeaders(origin = "") {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Handle preflight CORS requests
export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  const headers = getCORSHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

// POST: Create a new topic
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
    await Topic.create(data);

    return new NextResponse(
      JSON.stringify({ message: "Topic Created" }),
      {
        status: 201,
        headers,
      }
    );
  } catch (error) {
    console.error("Error creating topic:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}

// GET: Get topics with optional filters
export async function GET(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const skip = (page - 1) * limit;
    const sortByDate = searchParams.get("sortByDate") === "true";
    const search = searchParams.get("search");

    const query = {};
    if (type) query.type = type;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortOption = sortByDate ? { watchedDate: -1 } : {};

    const [topics, total] = await Promise.all([
      Topic.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Topic.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return new NextResponse(
      JSON.stringify({ topics, totalPages, total }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error fetching topics:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}

// DELETE: Delete a topic by ID
export async function DELETE(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "Missing ID" }),
        { status: 400, headers }
      );
    }

    await connectMongoDB();
    await Topic.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({ message: "Topic deleted" }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Error deleting topic:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}
