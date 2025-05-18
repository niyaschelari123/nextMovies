import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 px-6 py-4 shadow-md">
      <div className="max-w-8xl px-10 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-xl font-bold tracking-wide">
          OrtzakMovies
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center text-white text-sm font-medium">
          <Link href="/moviesList" className="hover:text-blue-300 transition">
            Movies
          </Link>
          <Link href="/seriesList" className="hover:text-blue-300 transition">
            Series
          </Link>
          <Link href="/animeList" className="hover:text-blue-300 transition">
            Anime
          </Link>
          <Link href="/documentaryList" className="hover:text-blue-300 transition">
            Documentary
          </Link>
          <Link href="/wishlist" className="hover:text-blue-300 transition">
            Wishlist
          </Link>
          <Link href="/watchHistory" className="hover:text-blue-300 transition">
            Watch History
          </Link>

          {/* Add Movie Button */}
          <Link
            href="/addTopic"
            className="bg-white text-slate-800 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold"
          >
            Add Movie
          </Link>
        </div>
      </div>
    </nav>
  );
}
