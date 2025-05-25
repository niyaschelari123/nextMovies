"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "@/components/RemoveBtn";
import dayjs from "dayjs";

const TABS = ["All", "Movies", "Series", "Anime", "Documentary"];

const WatchHistoryPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totals, setTotals] = useState();
  const limit = 120;

  const fetchMovies = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (activeTab !== "All") query.append("type", activeTab.toLowerCase());
    query.append("page", page);
    query.append("limit", limit);
    query.append("sortByDate", "true");

    fetch(`/api/topics?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data?.topics || []);
        setTotalPages(data?.totalPages || 1);
        setTotals(data?.total || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1); // reset page when tab changes
  }, [activeTab]);

  useEffect(() => {
    fetchMovies();
  }, [activeTab, page]);

function formatWatchedDate(dateString) {
  let date = dayjs(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ", true);
  if (!date.isValid()) {
    date = dayjs(dateString, "DD/MM/YYYY, hh:mm:ss a", true);
  }
  if (!date.isValid()) return dateString || "";
  
  // Format with date + 12-hour time + am/pm
  return date.format("MM/DD/YYYY, hh:mm:ss a");
}


  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Watch History</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setMovies([])
                setActiveTab(tab)}}
              className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
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

      {/* Total count display */}
      {movies?.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          Showing total:{" "}
          <span className="font-medium text-gray-800">
            {totals ?? 0} {activeTab === "All" ? "Items" : activeTab}
          </span>
        </div>
      )}
      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No {activeTab} Found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {movies.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200 text-xs"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-1 space-y-0.5">
                  <h2 className="font-semibold line-clamp-1">
                    {t.name} ({t.year})
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    {t.type} • {t.language}
                  </p>
                  {t.watchedDate && (
                    <p className="text-[10px] text-gray-400">
                      {formatWatchedDate(t.watchedDate)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WatchHistoryPage;
