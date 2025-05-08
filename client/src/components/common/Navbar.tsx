import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
    <div className="font-bold text-xl">Dev Profiles</div>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <Link to="/about" className="hover:underline">
        About
      </Link>
    </div>
  </nav>
);

export default Navbar; 