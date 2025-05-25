"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/firebase";

export default function RemoveBtn({ id, fetchMovies, wishlist, name, year }) {
  const router = useRouter();
  const [firebaseData, setFirebaseData] = useState();
  const user_email = "niyaschelari@gmail.com";
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token_next");
    setToken(storedToken);
  }, []);

  const fetchFromFireBase = async () => {
    let q;
    const user_email = "niyaschelari@gmail.com";

    q = query(
      collection(database, `${user_email}_col`),
      where("name", "==", String(name)),
      where("year", "==", String(year))
    );

    // Execute the query to fetch documents with the specified name
    const querySnapshot = await getDocs(q);

    // Extract data from the query snapshot
    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("single movie data", documents, name, year);
    setFirebaseData(
      documents?.map((data) => ({
        id: data.id,
        searchIndex: data?.searchIndex,
        title: data.name,
        year: data.year,
        language: data.language,
        genre: data.genre,
        img: data.images[0],
        type: data?.type,
        Watched_Date: data?.watchedDate?.toLowerCase(),
      }))
    );

    // const movie = documents?.map((data) => ({
    //   id: data.id,
    //   title: data.name,
    //   year: data.year,
    //   state: data.language,
    //   genre: data.genre,
    //   img: data.images[0],
    //   type: data?.type,
    // }));

    // setList(movie[0]);

    console.log("series documents are", documents);
  };

  console.log("firebase data is", firebaseData);

  useEffect(() => {
    if (name && year) fetchFromFireBase();
  }, [name, year]);

  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      let res;
      if (!wishlist) {
        try {
          const idValue = firebaseData[0]?.id;
          const docRef = doc(database, `${user_email}_col`, idValue);
          await deleteDoc(docRef);
          alert("Document successfully deleted!");
        } catch (error) {
          console.error("Error deleting document:", error);
        }
        res = await fetch(`/api/topics?id=${id}`, {
          method: "DELETE",

          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await fetch(`/api/wishlist?id=${id}`, {
          method: "DELETE",
        });
      }

      if (res.ok) {
        router.refresh();
        fetchMovies();
      }
    }
  };

  return (
    <button onClick={removeTopic} className="text-red-400">
      <HiOutlineTrash size={24} />
    </button>
  );
}
