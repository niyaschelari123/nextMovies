import EditTopicForm from "@/components/EditTopicForm";
import EditWishlistForm from "./EditWishListForm";

const getTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/wishlist/${id}`, {
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
  const { name, year, type, language, genre, image } = topic;

  return (
    <EditWishlistForm
      id={id}
      name={name}
      year={year}
      type={type}
      language={language}
      genre={genre}
      image={image}
    />
  );
}
