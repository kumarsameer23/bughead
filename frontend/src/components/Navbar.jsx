// File: frontend/src/components/Navbar.jsx
import React from "react";
import Link from "next/link";
import { Bug, Github, LayoutDashboard } from "lucide-react"; // ✅ Imported LayoutDashboard icon

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-neutral-900/50 py-4 px-6 md:px-12 border-b border-neutral-800 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <Link href="/" passHref>
          <div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105">
            <Bug className="text-blue-500 animate-pulse-slow" size={32} />
            <span className="text-xl font-bold text-white tracking-wide">BugHead</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link href="/admin/dashboard" passHref> {/* ✅ New Dashboard button */}
              <span className="py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <LayoutDashboard size={20} />
                Admin Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/signup" passHref>
              <span className="py-2 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                Sign Up
              </span>
            </Link>
          </li>
          <li>
            <Link href="/login" passHref>
              <span className="py-2 px-4 rounded-lg font-medium text-white bg-neutral-700 hover:bg-neutral-600 transition-colors duration-200">
                Login
              </span>
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/YourRepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <Github size={20} />
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
