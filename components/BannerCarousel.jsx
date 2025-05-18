"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const bannerImages = [
  'https://test-oumuamua.s3.us-east-2.amazonaws.com/e6fa09e7-7561-453c-b9cf-da841ce48e14.jpg',
  'https://test-oumuamua.s3.us-east-2.amazonaws.com/d14614d6-e710-43a5-967c-5418ae75b8da.jpg',
];

const BannerCarousel = () => {
  return (
    <div className="w-full aspect-[3.4]">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
      >
        {bannerImages.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
