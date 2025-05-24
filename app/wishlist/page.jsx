"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { PlusIcon } from "@heroicons/react/24/solid";
import RemoveBtn from "@/components/RemoveBtn";
import { createContext, useContext } from 'react';


const TABS = ["Movies", "Series", "Anime", "Documentary"];

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Movies");

  const fetchMovies = async () => {
    setLoading(true);
    fetch(`/api/wishlist?type=${activeTab.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data?.topics || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMovies();
  }, [activeTab]);


  return (

    <div className="w-full mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <Link
          href="/wishlist/addWishList"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add to Wishlist
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-all ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500 hover:border-blue-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No {activeTab} Found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {movies.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 capitalize">
                    {t.name} ({t.year})
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {t.type} • {t.language}
                  </p>
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
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {t.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    href={`/wishlist/editWishlist/${t._id}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={22} />
                  </Link>
                  <RemoveBtn
                    id={t._id}
                    fetchMovies={fetchMovies}
                    wishlist={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default MoviesPage;
