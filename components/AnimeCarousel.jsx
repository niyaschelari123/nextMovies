"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import RemoveBtn from "./RemoveBtn"; // make sure this exists
import "swiper/css";
import "swiper/css/navigation";
import { useModalContext } from "./ModalContext";

const AnimeCarousel = () => {
  const [animes, setAnimes] = useState([]);
  const { isModalOpen, setIsModalOpen, editId, setEditId } = useModalContext();

   useEffect(() => {
      fetchMovies();
    }, []);
  
    const fetchMovies = async () => {
      fetch("/api/topics?type=anime&page=1&limit=30&randomData=true")
        .then((res) => res.json())
        .then((data) => setAnimes(data?.topics || []));
    };

  return (
    <div className="my-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left">
        Anime
      </h2>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {animes.map((anime) => (
          <SwiperSlide key={anime._id}>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col h-full">
              <img
                src={anime.image}
                alt={anime.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 capitalize mb-1">
                    {anime.name} ({anime.year})
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {anime.type} • {anime.language}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genre.map((g, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  {anime.description && (
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {anime.description}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  {/* <Link
                    href={`/editTopic/${anime._id}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={20} />
                  </Link> */}
                  <button
                    onClick={() => {
                      setEditId(anime?._id)}}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={20} />
                  </button>
                  <RemoveBtn id={anime._id} fetchMovies={fetchMovies}/>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnimeCarousel;
