import AnimeCarousel from "@/components/AnimeCarousel";
import BannerCarousel from "@/components/BannerCarousel";
import MovieCarousel from "@/components/MovieCarousel";
import SeriesCarousel from "@/components/SeriesCarousel";
import TopicsList from "@/components/TopicsList";

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <MovieCarousel />
      <SeriesCarousel />
      <AnimeCarousel />
      {/* <TopicsList /> */}
    </>
  );
}
