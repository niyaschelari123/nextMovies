import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name").toLowerCase();
    const year = searchParams.get("year").toLowerCase();

    if (!name || !year) {
      return NextResponse.json({ message: "Missing name or year" }, { status: 400 });
    }

    await connectMongoDB(); // Ensure DB is connected
    const existing = await Topic.findOne({
      name,
      year: parseInt(year),
    });

    return NextResponse.json({...existing?._doc,exists: true});
  } catch (error) {
    console.error("Error in /api/topics/check:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
