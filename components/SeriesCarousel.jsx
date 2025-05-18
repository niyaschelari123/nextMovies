"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn from "./RemoveBtn";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const SeriesCarousel = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch("/api/topics?type=series")
      .then((res) => res.json())
      .then((data) => setSeries(data?.topics || []));
  }, []);

  return (
    <div className="my-8 px-4 py-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Series</h2>
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={2.5}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          320: { slidesPerView: 1.1 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2.5 },
        }}
      >
        {series.map((t) => (
          <SwiperSlide key={t._id}>
            <div className="flex bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-64">
              <div className="w-1/2 h-full">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-1/2 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 capitalize">
                    {t.name} ({t.year})
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {t.type} • {t.language}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {t.genre.map((g, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-700 line-clamp-3">
                      {t.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <Link
                    href={`/editTopic/${t._id}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <HiPencilAlt size={20} />
                  </Link>
                  <RemoveBtn id={t._id} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SeriesCarousel;
