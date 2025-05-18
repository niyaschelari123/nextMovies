import connectMongoDB from "@/libs/mongodb";
import Wishlist from "@/models/wishlist";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // or specific origin
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Data received:", data);

    await connectMongoDB();
    await Wishlist.create(data);

    return NextResponse.json(
      { message: "Added Show to Wishlist" },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "*", // or your specific domain
        },
      }
    );
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectMongoDB();

  // Extract 'type' from query parameters
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let topics;

  if (type) {
    topics = await Wishlist.find({ type }); // Filter by type
  } else {
    topics = await Wishlist.find(); // Return all if no type is specified
  }

  return NextResponse.json({ topics });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Wishlist.findByIdAndDelete(id);
  return NextResponse.json({ message: "Data deleted" }, { status: 200 });
}
