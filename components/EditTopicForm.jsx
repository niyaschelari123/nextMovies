"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

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

export default function EditTopicForm({
  id,
  name,
  year,
  type,
  language,
  genre,
  image,
  watchedDate,
}) {
  const [newName, setNewName] = useState(name);
  const [newYear, setNewYear] = useState(year);
  const [newType, setNewType] = useState(type);
  const [newLanguage, setNewLanguage] = useState(language);
  const [newGenre, setNewGenre] = useState(genre || []);
  const [newImage, setNewImage] = useState(image);
    const [languageArray, setLanguageArray] = useState([]);

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

    let formattedWatchedDate;
    if (watchedDateOption === "dontRemember") {
      formattedWatchedDate = undefined;
    } else if (watchedDateOption === "today") {
      formattedWatchedDate = dayjs().format("YYYY-MM-DDTHH:mm");
    } else if (watchedDateOption === "chooseDate" && watchedDateInput) {
      formattedWatchedDate = watchedDateInput;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
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
          watchedDate: formattedWatchedDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update movie");
      }

      router.refresh();
      router.push("/");
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
        Edit Movie
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
      <div>
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
      </div>

      <input
        value={newImage}
        onChange={(e) => setNewImage(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
        type="text"
        placeholder="Image URL"
      />

      {/* Watched Date Section */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <p className="font-semibold text-gray-700 mb-2">Watched Date</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="watchedDate"
              value="dontRemember"
              checked={watchedDateOption === "dontRemember"}
              onChange={() => setWatchedDateOption("dontRemember")}
            />
            Dont Remember
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="watchedDate"
              value="today"
              checked={watchedDateOption === "today"}
              onChange={() => setWatchedDateOption("today")}
            />
            Today
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="watchedDate"
              value="chooseDate"
              checked={watchedDateOption === "chooseDate"}
              onChange={() => setWatchedDateOption("chooseDate")}
            />
            Choose Date
          </label>
        </div>

        {watchedDateOption === "chooseDate" && (
          <div className="mt-3">
            <input
              type="datetime-local"
              value={watchedDateInput}
              onChange={(e) => setWatchedDateInput(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700 transition w-fit mx-auto"
      >
        Update Movie
      </button>
    </form>
  );
}
