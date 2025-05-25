import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    name: String,
    year: Number,
    type: String,
    language: String,
    genre: Array,
    image: String,
    watchedDate: Date,
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;
