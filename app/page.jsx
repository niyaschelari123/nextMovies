'use client'; // 👈 Required for using client hooks like useContext

import AnimeCarousel from "@/components/AnimeCarousel";
import BannerCarousel from "@/components/BannerCarousel";
import { useModalContext } from "@/components/ModalContext";
import MovieCarousel from "@/components/MovieCarousel";
import SeriesCarousel from "@/components/SeriesCarousel";
import TopicsList from "@/components/TopicsList";
import EditTopicModal from "@/components/EditTopicModal";

export default function Home() {
  const { isModalOpen, setIsModalOpen, editId, setEditId } = useModalContext();
  console.log('edit id in home', editId)

  return (
    <>
      <BannerCarousel />
      <MovieCarousel />
      <SeriesCarousel />
      <AnimeCarousel />
      {editId && (
        <EditTopicModal id={editId} onClose={() => setEditId(null)} />
      )}
      {/* <TopicsList /> */}
    </>
  );
}
