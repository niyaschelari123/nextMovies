'use client';
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: install lucide-react or use SVGs

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-800 px-6 py-4 shadow-md">
      <div className="max-w-8xl px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-xl font-bold tracking-wide">
          OrtzakMovies
        </Link>

        {/* Hamburger icon - visible on mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links - hidden on mobile, visible on md+ */}
        <div className="hidden md:flex gap-6 items-center text-white text-sm font-medium">
          <Link href="/moviesList" className="hover:text-blue-300 transition">Movies</Link>
          <Link href="/seriesList" className="hover:text-blue-300 transition">Series</Link>
          <Link href="/animeList" className="hover:text-blue-300 transition">Anime</Link>
          <Link href="/documentaryList" className="hover:text-blue-300 transition">Documentary</Link>
          <Link href="/wishlist" className="hover:text-blue-300 transition">Wishlist</Link>
          <Link href="/watchHistory" className="hover:text-blue-300 transition">Watch History</Link>
          
          <Link
            href="/addTopic"
            className="bg-white text-slate-800 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold"
          >
            Add Movie
          </Link>
        </div>
      </div>

      {/* Mobile Menu - only visible when menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-white text-sm font-medium">
          <Link href="/moviesList" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link href="/seriesList" onClick={() => setMenuOpen(false)}>Series</Link>
          <Link href="/animeList" onClick={() => setMenuOpen(false)}>Anime</Link>
          <Link href="/documentaryList" onClick={() => setMenuOpen(false)}>Documentary</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link href="/watchHistory" onClick={() => setMenuOpen(false)}>Watch History</Link>
          <Link href="/firebaseMovies" className="hover:text-blue-300 transition">Firebase Movies</Link>
          <Link href="/login" className="hover:text-blue-300 transition">Login</Link>
          <Link
            href="/addTopic"
            className="bg-white text-slate-800 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Add Movie
          </Link>
        </div>
      )}
    </nav>
  );
}
