"use client";

import { useState, useEffect } from "react";

const USERNAME = 'ortzak123';
const PASSWORD = 'ortzak123';

export default function AuthGate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth-ok");
    if (storedAuth === "true") {
      setAuthorized(true);
    } else {
      setShowModal(true);
    }
  }, []);

  const handleLogin = () => {
    if (inputUser === USERNAME && inputPass === PASSWORD) {
      localStorage.setItem("auth-ok", "true");
      setAuthorized(true);
      setShowModal(false);
    } else {
      alert("Invalid credentials");
    }
  };

  if (!authorized && showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Restricted Access</h2>
          <input
            type="text"
            placeholder="Username"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            className="mb-2 w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            className="mb-4 w-full border p-2 rounded"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
