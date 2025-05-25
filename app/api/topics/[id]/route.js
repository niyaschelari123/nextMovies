// import connectMongoDB from "@/libs/mongodb";
// import Topic from "@/models/topic";
// import { NextResponse } from "next/server";

// export async function PUT(request, { params }) {
//   const { id } = params;
//   const data = await request.json();
//   await connectMongoDB();
//   await Topic.findByIdAndUpdate(id, data);
//   return NextResponse.json({ message: "Topic updated" }, { status: 200 });
// }

// export async function GET(request, { params }) {
//   const { id } = params;
//   await connectMongoDB();
//   const topic = await Topic.findOne({ _id: id });
//   return NextResponse.json({ topic }, { status: 200 });
// }


import { verifyToken } from "@/lib/auth";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

// Allowed origins
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://next-movies-s97f.vercel.app",
];

// Generate dynamic CORS headers
function getCORSHeaders(origin = "") {
  const headers = {
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

// Handle OPTIONS request for preflight
export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  const headers = getCORSHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

// PUT: Update topic
export async function PUT(request, { params }) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    verifyToken(request); // will throw error if token is invalid
    const { id } = params;
    const data = await request.json();

    await connectMongoDB();
    await Topic.findByIdAndUpdate(id, data);

    return new NextResponse(
      JSON.stringify({ message: "Topic updated" }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}

// GET: Fetch topic by ID
export async function GET(request, { params }) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...getCORSHeaders(origin),
    "Content-Type": "application/json",
  };

  try {
    const { id } = params;

    await connectMongoDB();
    const topic = await Topic.findOne({ _id: id });

    return new NextResponse(
      JSON.stringify({ topic }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers,
      }
    );
  }
}
