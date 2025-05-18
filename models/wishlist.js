import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    name: String,
    year: String,
    type: String,
    language: String,
    genre: Array,
    image: String,
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
