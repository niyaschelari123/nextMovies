"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

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

const genres = [
  { genre_id: 28, name: "Action" },
  { genre_id: 12, name: "Adventure" },
  { genre_id: 16, name: "Animation" },
  { genre_id: 35, name: "Comedy" },
  { genre_id: 80, name: "Crime" },
  { genre_id: 99, name: "Documentary" },
  { genre_id: 18, name: "Drama" },
  { genre_id: 10751, name: "Family" },
  { genre_id: 14, name: "Fantasy" },
  { genre_id: 36, name: "History" },
  { genre_id: 27, name: "Horror" },
  { genre_id: 10402, name: "Music" },
  { genre_id: 9648, name: "Mystery" },
  { genre_id: 10749, name: "Romance" },
  { genre_id: 878, name: "Science Fiction" },
  { genre_id: 10770, name: "TV Movie" },
  { genre_id: 53, name: "Thriller" },
  { genre_id: 10752, name: "War" },
  { genre_id: 37, name: "Western" },
];

export default function Wishlist() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [genre, setGenre] = useState([]);
  const [image, setImage] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [watchedOptionForFound, setWatchedOptionForFound] =
    useState("dontRemember");
  const [watchedDateForFound, setWatchedDateForFound] = useState("");

  const [watchedDateOption, setWatchedDateOption] = useState("dontRemember");
  const [watchedDate, setWatchedDate] = useState("");

  const [existingMovie, setExistingMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [findModal, setFindModal] = useState(false);
  const [foundMovies, setFoundMovies] = useState([]);
  const [languageArray, setLanguageArray] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);

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

  const router = useRouter();

  const handleGenreChange = (value) => {
    setGenre((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e, override = false) => {
    e.preventDefault();

    if (!name || !year || !type || !language || genre.length === 0 || !image) {
      alert("All fields are required.");
      return;
    }

    let formattedWatchedDate;
    if (watchedDateOption === "dontRemember") {
      formattedWatchedDate = undefined;
    } else if (watchedDateOption === "today") {
      formattedWatchedDate = dayjs().format("DD/MM/YYYY, hh:mm:ss a");
    } else if (watchedDateOption === "chooseDate" && watchedDate) {
      formattedWatchedDate = dayjs(watchedDate).format(
        "DD/MM/YYYY, hh:mm:ss a"
      );
    }

    try {
      if (!override) {
        const checkRes = await fetch(
          `http://localhost:3000/api/wishlist/check?name=${encodeURIComponent(
            name
          )}&year=${year}`
        );
        const existing = await checkRes.json();

        if (existing.name) {
          setExistingMovie(existing);
          setShowModal(true);
          return;
        }
      }

      const res = await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: name.toLowerCase(),
          year,
          type,
          language,
          genre,
          image,
          // watchedDate: formattedWatchedDate,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to add movie");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitFound = async (e, override = false) => {
    e.preventDefault();

    if (
      !existingMovie.name ||
      !existingMovie.year ||
      !existingMovie.type ||
      !existingMovie.language ||
      existingMovie.genre.length === 0 ||
      !existingMovie.image
    ) {
      alert("All fields are required.");
      return;
    }

    console.log("selected card is", selectedCard);

    let formattedWatchedDate;
    if (watchedDateOption === "dontRemember") {
      formattedWatchedDate = undefined;
    } else if (watchedDateOption === "today") {
      formattedWatchedDate = dayjs().format("DD/MM/YYYY, hh:mm:ss a");
    } else if (watchedDateOption === "chooseDate" && watchedDate) {
      formattedWatchedDate = dayjs(watchedDate).format(
        "DD/MM/YYYY, hh:mm:ss a"
      );
    }

    const values = {
      name: selectedCard?.title.toLowerCase() || selectedCard?.name.toLowerCase(),
      year: selectedCard?.release_date
        ? selectedCard?.release_date.slice(0, 4)
        : selectedCard?.first_air_date?.slice(0, 4),
      genre: selectedCard?.genre_ids
        .map((id) => {
          const genre = genres.find((g) => g.genre_id === id);
          return genre ? genre.name : null;
        })
        .filter(Boolean),
      language: selectedCard?.original_language,
      type: type.toLowerCase(),
      image: `https://image.tmdb.org/t/p/original${selectedCard?.poster_path}`,
      // watchedDate: formattedWatchedDate ? formattedWatchedDate : null,
    };

    try {
      const res = await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to add movie");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const findMovie = async () => {
    const movieName = name;
    const yearValue = year;
    const typeValue = type.toLowerCase(); // "movies" or "series"

    const movieURL = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      movieName
    )}&year=${yearValue}`;

    const seriesURL = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      movieName
    )}&first_air_date_year=${yearValue}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTg4MzU1OGQyMTNiMDY1OWExYjAxNWQzNDhjNWI2ZCIsIm5iZiI6MTcxOTUxMTQ0My40Mzk5MjEsInN1YiI6IjY2N2RhOGUxMDVmODA0ZWNkNTE3M2JjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VCvmdO99YbSCjQzjex6ytNnGMT2jHHfy4ZUelJaVugc",
      },
    };

    const url = typeValue === "series" ? seriesURL : movieURL;

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const results = data.results;

      if (results.length > 0) {
        const filtered =
          typeValue === "series"
            ? results.filter(
                (item) => item.first_air_date?.slice(0, 4) === yearValue
              )
            : results.filter(
                (item) => item.release_date?.slice(0, 4) === yearValue
              );

        setFoundMovies(filtered);
        setFindModal(true);
        console.log("Found movies/series:", filtered);
      } else {
        alert("No results found.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Modal */}
      {showModal && existingMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Movie Already Exists
            </h3>
            <p className="mb-2">
              <strong>{existingMovie.name}</strong> ({existingMovie.year})
              already exists.
            </p>
            <img
              src={existingMovie.image}
              alt={existingMovie.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="mb-4 text-gray-700">
              Do you still want to add the movie?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleSubmitFound(e,true) // Open the date selection modal
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}

    

      {/* Main Form */}
      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add to Wishlist
        </h2>

        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="border border-gray-300 rounded px-4 py-2"
          type="text"
          placeholder="Movie Name"
        />

        <input
          onChange={(e) => setYear(e.target.value)}
          value={year}
          className="border border-gray-300 rounded px-4 py-2"
          type="number"
          placeholder="Release Year"
        />

        {/* Find Button */}
        <button
          type="button"
          onClick={findMovie}
          disabled={!name || !year}
          className={`px-4 py-2 rounded font-semibold ${
            !name || !year
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Find Movie
        </button>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
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

        {/* Genre Checkboxes */}
        <div>
          <p className="mb-2 font-medium">Select Genres:</p>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((g) => (
              <label key={g} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={genre.includes(g)}
                  onChange={() => handleGenreChange(g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        <input
          onChange={(e) => setImage(e.target.value)}
          value={image}
          className="border border-gray-300 rounded px-4 py-2"
          type="text"
          placeholder="Image URL"
        />

        <button
          type="submit"
          className="bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition w-fit mx-auto"
        >
          Add Movie
        </button>
      </form>

      {/* Found Movie Modal Placeholder (customize if needed) */}
      {findModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Found Movies</h2>
            <ul className="space-y-4">
              {foundMovies.map((movie) => {
                const isSelected = selectedCard?.id === movie.id;
                return (
                  <li
                    key={movie.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {movie.title || movie.name} (
                        {(movie.release_date || movie.first_air_date)?.slice(
                          0,
                          4
                        )}
                        )
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {movie.overview.slice(0, 100)}...
                      </p>
                      {!isSelected ? (
                        <button
                          onClick={async () => {
                            setSelectedCard(movie);
                            const checkRes = await fetch(
                              `http://localhost:3000/api/wishlist/check?name=${encodeURIComponent(
                                name
                              )}&year=${year}`
                            );
                            const existing = await checkRes.json();

                            if (existing.name) {
                              setExistingMovie(existing);
                              setShowModal(true);
                              setFindModal(false);
                              return;
                            }

                            // setSelectedCard(movie);
                            setWatchedOptionForFound("dontRemember");
                            setWatchedDateForFound("");
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Select Movie
                        </button>
                      ) : (
                        <div className="space-y-2">
                      

                          <button
                            onClick={async () => {
                              console.log(
                                "watched option rrr",
                                watchedOptionForFound
                              );
                              const formattedWatchedDate =
                                watchedOptionForFound === "dontRemember"
                                  ? undefined
                                  : watchedOptionForFound === "today"
                                  ? dayjs().format("DD/MM/YYYY, hh:mm:ss a")
                                  : watchedOptionForFound === "chooseDate" &&
                                    watchedDateForFound
                                  ? dayjs(watchedDateForFound).format(
                                      "DD/MM/YYYY, hh:mm:ss a"
                                    )
                                  : undefined;

                              console.log(
                                "formatted rrr",
                                formattedWatchedDate
                              );

                              const values = {
                                name:
                                  movie.title.toLowerCase() ||
                                  movie.name.toLowerCase(),
                                year: movie.release_date
                                  ? movie.release_date.slice(0, 4)
                                  : movie.first_air_date?.slice(0, 4),
                                genre: movie.genre_ids
                                  .map((id) => {
                                    const genre = genres.find(
                                      (g) => g.genre_id === id
                                    );
                                    return genre ? genre.name : null;
                                  })
                                  .filter(Boolean),
                                language: movie.original_language,
                                type: type.toLowerCase(),
                                image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                              };

                              try {
                                const res = await fetch("/api/wishlist", {
                                  method: "POST",
                                  headers: {
                                    "Content-type": "application/json",
                                  },
                                  body: JSON.stringify(values),
                                });

                                if (res.ok) {
                                  setFindModal(false);
                                  router.push("/");
                                } else {
                                  throw new Error("Failed to add movie");
                                }
                              } catch (err) {
                                console.error(err);
                                alert("Error adding movie");
                              }
                            }}
                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Add Movie
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setFindModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
