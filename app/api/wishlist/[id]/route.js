import connectMongoDB from "@/libs/mongodb";
import Wishlist from "@/models/wishlist";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();
  await connectMongoDB();
  await Wishlist.findByIdAndUpdate(id, data);
  return NextResponse.json({ message: "Topic updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const topic = await Wishlist.findOne({ _id: id });
  return NextResponse.json({ topic }, { status: 200 });
}
