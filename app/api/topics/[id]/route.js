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


import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

// Common CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Change "*" to your domain in production
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle OPTIONS request for preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// PUT: Update topic
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    await connectMongoDB();
    await Topic.findByIdAndUpdate(id, data);

    return new NextResponse(
      JSON.stringify({ message: "Topic updated" }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

// GET: Fetch topic by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    await connectMongoDB();
    const topic = await Topic.findOne({ _id: id });

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
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
