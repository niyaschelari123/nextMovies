"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import RemoveBtn from "./RemoveBtn";

import "swiper/css";
import "swiper/css/navigation";
import EditTopicModal from "./EditTopicModal";
import { useModalContext } from "./ModalContext";

const MovieCarousel = () => {
  const [movies, setMovies] = useState([]);
  // const [editId, setEditId] = useState(null);
  const { isModalOpen, setIsModalOpen, editId, setEditId } = useModalContext();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    fetch("/api/topics?type=movies&page=1&limit=30&randomData=true")
      .then((res) => res.json())
      .then((data) => setMovies(data?.topics || []));
  };

  return (
    <div className="my-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Movies</h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        // navigation
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
      >
        {movies.map((t) => (
          <SwiperSlide key={t._id}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
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
                  {/* <Link
                    href={`/editTopic/${t._id}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={22} />
                  </Link> */}
                  <button
                    onClick={() => {
                      setEditId(t?._id);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={20} />
                  </button>
                  <RemoveBtn id={t._id} fetchMovies={fetchMovies} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* {editId && (
        <EditTopicModal id={editId} onClose={() => setEditId(null)} />
      )} */}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
