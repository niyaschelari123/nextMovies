"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "@/components/RemoveBtn";
import { useModalContext } from "@/components/ModalContext";
import EditTopicModal from "@/components/EditTopicModal";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/firebase";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [firebaseMovies, setFirebaseMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const searchTimeoutRef = useRef(null);
  const { isModalOpen, setIsModalOpen, editId, setEditId } = useModalContext();
  const router = useRouter();
  console.log('firebase movies', firebaseMovies,movies)

  const fetchSeries = async () => {
    let q;

    const user_email = "niyaschelari@gmail.com";
    q = query(
      collection(database, `${user_email}_col`),
      where("type", "==", activeTab),
      limit(100)
    );

    try {
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setFirebaseMovies(
        documents.map((data) => ({
          id: data.id,
          title: data.name,
          year: data.year,
          state: data.language,
          genre: data.genre,
          img: data.images[0],
          type: data.type,
          language: data?.language,
          watchedDate: data?.watchedDate,
        }))
      );
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, [activeTab]);

  const fetchMovies = async (searchTerm = "") => {
    setLoading(true);
    const params = new URLSearchParams({ type: activeTab });
    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }

    fetch(`/api/topics?${params.toString()}&page=1&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data?.topics || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchMovies(search);
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search, activeTab]);

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);

  const checkExist = (t) => {
    const isFound = movies?.find(
      (item) => item?.name == t?.title && item?.year == t?.year
    );
    if (isFound) {
      return (
        <p className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Added
        </p>
      );
    } else {
      return (
        <>
          <p className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-2">
            Not Added
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
            onClick={() => addToMongo(t)}
          >
            Add to MongoDB
          </button>
        </>
      );
    }
  };

  function convertToISO(datetimeStr) {
    if (!datetimeStr) return null;

    if (datetimeStr.includes(",")) {
      const [datePart, timePartWithAmPm] = datetimeStr.split(", ");
      const [day, month, year] = datePart.split("/");
      const isoString = `${year}-${month}-${day} ${timePartWithAmPm}`;
      const dateObj = new Date(isoString);
      return isNaN(dateObj) ? null : dateObj;
    } else {
      const [datePart, timePart] = datetimeStr.split(" ");
      const [day, month, year] = datePart.split("-");
      const isoString = `${year}-${month}-${day}T${timePart}`;
      const dateObj = new Date(isoString);
      return isNaN(dateObj) ? null : dateObj;
    }
  }

  const addToMongo = async (t) => {
    const values = {
      name: t?.title,
      year: t?.year,
      genre: t?.genre,
      type: t?.type,
      language: t?.language,
      image: t?.img,
      watchedDate:
        t?.watchedDate != "Dont Remember"
          ? convertToISO(t?.watchedDate)
          : t?.watchedDate,
    };
    const user_email = "niyaschelari@gmail.com";
    await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    });

    fetchSeries();
    fetchMovies();
    router.refresh();
    alert("Show Added Successfully");
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All {capitalizeFirstLetter(activeTab)}</h1>

        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {["movies", "series", "anime", "documentary"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {capitalizeFirstLetter(tab)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (movies.length === 0 && firebaseMovies?.length==0) ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No {capitalizeFirstLetter(activeTab)} Found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {firebaseMovies.map((t) => {
            const isExist = movies?.find(
              (item) => item?.name == t?.title && item?.year == t?.year
            );
            console.log('is exist value', isExist)
            if (!isExist)
              return (
                <div
                  key={t._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full"
                >
                  <img
                    src={t.img}
                    alt={t.title}
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-1 capitalize">
                        {t.title} ({t.year})
                      </h2>
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {t.genre}
                        </span>
                      </div>
                    </div>
                    <div>{checkExist(t)}</div>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => {
                          setEditId(t?._id);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <HiPencilAlt size={20} />
                      </button>
                      <RemoveBtn
                        id={t._id}
                        fetchMovies={() => fetchMovies(search)}
                        name={t.name}
                        year={t.year}
                      />
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      )}
      {editId && <EditTopicModal id={editId} onClose={() => setEditId(null)} />}
    </div>
  );
};

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default MoviesPage;