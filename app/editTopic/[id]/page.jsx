'use client'
import EditTopicForm from "@/components/EditTopicForm";
import { useEffect } from "react";

const getTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function EditTopic({ params }) {
  const { id } = params;
  const { topic } = await getTopicById(id);
  const { name, year, type, language, genre, image, watchedDate } = topic;


  return (
    <EditTopicForm
      id={id}
      name={name}
      year={year}
      type={type}
      language={language}
      genre={genre}
      image={image}
      watchedDate = {watchedDate}
    />
  );
}
