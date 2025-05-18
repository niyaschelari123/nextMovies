import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

const getTopics = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/topics", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading topics: ", error);
  }
};

export default async function TopicsList() {
  const topicsObject = await getTopics();
  const topics = topicsObject?.topics;

  return (
    <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {topics?.map((t) => (
        <div
          key={t._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col"
        >
          <img
            src={t.image}
            alt={t.name}
            className="w-full h-60 object-cover"
          />

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1 capitalize">{t.name} ({t.year})</h2>
              <p className="text-sm text-gray-500 mb-2">{t.type} • {t.language}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {t.genre.map((g, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
              {t.description && (
                <p className="text-sm text-gray-700 line-clamp-3">{t.description}</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Link
                href={`/editTopic/${t._id}`}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <HiPencilAlt size={22} />
              </Link>
              <RemoveBtn id={t._id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
