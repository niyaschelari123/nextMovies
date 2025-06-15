'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import jwt_decode from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("next_movies_user");
    setUser(storedUser);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      const token = localStorage.getItem("token_next");
      if (token) {
        try {
          
          const decoded = jwt_decode(token);
          alert('enter')
          console.log('decoded value', decoded)
          
          setUser(decoded.username); // assuming { username } is in the token
        } catch (e) {
          console.error("Invalid token");
        }
      }
    }
  }, []);

  const handleLogout = () => {
  try {
    localStorage.removeItem("token_next");
    localStorage.removeItem("next_movies_user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setUser(null);
    toast.success("Logged out successfully!"); // ✅ Success message
    router.push("/login");
  } catch (error) {
    toast.error("Something went wrong during logout."); // ❌ Failure message
    console.error("Logout error:", error);
  }
};

  return (
    <nav className="bg-slate-800 px-6 py-4 shadow-md">
      <div className="max-w-8xl px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white text-xl font-bold tracking-wide">
          OrtzakMovies
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center text-white text-sm font-medium">
          <Link href="/moviesList" className="hover:text-blue-300 transition">Movies</Link>
          <Link href="/seriesList" className="hover:text-blue-300 transition">Series</Link>
          <Link href="/animeList" className="hover:text-blue-300 transition">Anime</Link>
          <Link href="/documentaryList" className="hover:text-blue-300 transition">Documentary</Link>
          <Link href="/wishlist" className="hover:text-blue-300 transition">Wishlist</Link>
          <Link href="/watchHistory" className="hover:text-blue-300 transition">Watch History</Link>
          <Link href="/addTopic" className="bg-white text-slate-800 px-4 py-2 rounded hover:bg-gray-200 transition font-semibold">Add Movie</Link>

          {/* Auth Section */}
          {user ? (
            <>
              <span className="text-blue-300">Hi, {user}</span>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-200">Logout</button>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-blue-300">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-white text-sm font-medium">
          <Link href="/moviesList" onClick={() => setMenuOpen(false)}>Movies</Link>
          <Link href="/seriesList" onClick={() => setMenuOpen(false)}>Series</Link>
          <Link href="/animeList" onClick={() => setMenuOpen(false)}>Anime</Link>
          <Link href="/documentaryList" onClick={() => setMenuOpen(false)}>Documentary</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link href="/watchHistory" onClick={() => setMenuOpen(false)}>Watch History</Link>
          <Link href="/addTopic" onClick={() => setMenuOpen(false)}>Add Movie</Link>

          {user ? (
            <>
              <span className="text-blue-300">Hi, {user}</span>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-400">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
