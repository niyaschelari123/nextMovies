"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ListCollapse, ChevronDown, ChevronUp } from "lucide-react";

const typeOptions = ["movies", "series", "anime", "documentary"];
const languageOptions = ["English", "Hindi", "Spanish", "French", "Japanese"];
const genreOptions = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Sports",
  "Thriller",
  "War",
  "Western",
  "Documentary",
  "Biography",
  "Family",
  "Superhero",
  "Martial Arts",
  "Spy",
  "Disaster",
  "Teen",
  "Holiday",
  "Noir",
  "Surreal",
  "Independent",
  "Experimental",
];

export default function EditWishlistForm({
  id,
  name,
  year,
  type,
  language,
  genre,
  image,
  watchedDate,
  onClose
}) {
  const [newName, setNewName] = useState(name);
  const [newYear, setNewYear] = useState(year);
  const [newType, setNewType] = useState(type);
  const [newLanguage, setNewLanguage] = useState(language);
  const [newGenre, setNewGenre] = useState(genre || []);
  const [newImage, setNewImage] = useState(image);
    const [languageArray, setLanguageArray] = useState([]);
      const [open, setOpen] = useState(false);

  const fetchLanguages = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTg4MzU1OGQyMTNiMDY1OWExYjAxNWQzNDhjNWI2ZCIsIm5iZiI6MTcxOTUxMTQ0My40Mzk5MjEsInN1YiI6IjY2N2RhOGUxMDVmODA0ZWNkNTE3M2JjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VCvmdO99YbSCjQzjex6ytNnGMT2jHHfy4ZUelJaVugc",
      },
    };

    await fetch("https://api.themoviedb.org/3/configuration/languages", options)
      .then((response) => response.json())
      .then((response) => {
        console.log("languages are", response);
        setLanguageArray(response);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const [watchedDateOption, setWatchedDateOption] = useState("dontRemember");
  const [watchedDateInput, setWatchedDateInput] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (watchedDate) {
      setWatchedDateOption("chooseDate");

      // Convert "DD/MM/YYYY, hh:mm:ss a" → datetime-local format
      const parsed = dayjs(watchedDate, "DD/MM/YYYY, hh:mm:ss a");
      if (parsed.isValid()) {
        setWatchedDateInput(parsed.format("YYYY-MM-DDTHH:mm"));
      }
    } else {
      setWatchedDateOption("dontRemember");
    }
  }, [watchedDate]);

  const handleGenreChange = (value) => {
    setNewGenre((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let formattedWatchedDate;
    // if (watchedDateOption === "dontRemember") {
    //   formattedWatchedDate = undefined;
    // } else if (watchedDateOption === "today") {
    //   formattedWatchedDate = dayjs().format("YYYY-MM-DDTHH:mm");
    // } else if (watchedDateOption === "chooseDate" && watchedDateInput) {
    //   formattedWatchedDate = watchedDateInput;
    // }

    try {
      const res = await fetch(`http://localhost:3000/api/wishlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: newName?.toLowerCase(),
          year: parseInt(newYear),
          type: newType,
          language: newLanguage,
          genre: newGenre,
          image: newImage,
          // watchedDate: formattedWatchedDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update movie");
      }

      router.refresh();
      // router.push("/");
      onClose()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Edit Show
      </h2>

      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
        type="text"
        placeholder="Movie Name"
      />

      <input
        value={newYear}
        onChange={(e) => setNewYear(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
        type="number"
        placeholder="Release Year"
      />

      <select
        value={newType}
        onChange={(e) => setNewType(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
      >
        {typeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={newLanguage}
        onChange={(e) => setNewLanguage(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
      >
        {languageArray
            .slice() // Create a shallow copy to avoid mutating state
            .sort((a, b) => a.english_name.localeCompare(b.english_name))
            .map((lang) => (
              <option key={lang?.iso_639_1} value={lang?.iso_639_1}>
                {lang?.english_name}
              </option>
            ))}
      </select>
      {/* <div>
        <p className="mb-2 font-medium">Select Genres:</p>
        <div className="flex flex-wrap gap-2">
          {genreOptions.map((g) => (
            <label key={g} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newGenre.includes(g)}
                onChange={() => handleGenreChange(g)}
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div> */}
       <div className="border rounded-md mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center px-4 py-2 bg-slate-100 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 font-medium">
          <ListCollapse size={18} />
          <span>Select Genres</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {/* Collapsible Genre List */}
      {open && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((g) => (
              <label key={g} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newGenre.includes(g)}
                  onChange={() => handleGenreChange(g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>

      <input
        value={newImage}
        onChange={(e) => setNewImage(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
        type="text"
        placeholder="Image URL"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition w-fit mx-auto"
      >
        Update Show
      </button>
    </form>
  );
}
