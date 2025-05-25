"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "@/components/RemoveBtn";
import { useModalContext } from "@/components/ModalContext";
import EditTopicModal from "@/components/EditTopicModal";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const searchTimeoutRef = useRef(null);
  const { isModalOpen, setIsModalOpen, editId, setEditId } = useModalContext();

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 60;

  const fetchMovies = async (searchTerm = "", page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ type: "movies", page, limit });
    if (searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }

    fetch(`/api/topics?${params.toString()}&&randomData=true`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data?.topics || []);
        setTotalPages(Math.ceil((data?.total || 0) / limit));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchMovies(search, 1);
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [search]);

  // Initial fetch
  useEffect(() => {
    fetchMovies(search, currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Movies</h1>

        {/* Search box */}
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
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No Movies Found.</p>
        </div>
      ) : (
        <>
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
                      fetchMovies={() => fetchMovies(search, currentPage)}
                      name={t.name}
                      year={t.year}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>

            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {editId && (
        <EditTopicModal id={editId} onClose={() => setEditId(null)} />
      )}
    </div>
  );
};

export default MoviesPage;
