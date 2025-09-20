"use client";

import React, { useState, useEffect } from "react";
import { Bug, Github, Menu, X, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(!!token);

    const handlePopState = () => {
      if (isLoggedIn && window.location.pathname === "/") {
        handleLogout();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isLoggedIn]); // Add isLoggedIn as a dependency

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    toast.success("Logged out successfully! 👋");
    router.push("/");
  };

  const menuItems = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-neutral-900/50 py-3 px-4 md:px-12 border-b border-neutral-800 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        {isLoggedIn ? (
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <Bug className="text-blue-500 animate-pulse-slow" size={32} />
            <span className="text-xl font-bold text-white tracking-wide">
              BugHead
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <Bug className="text-blue-500 animate-pulse-slow" size={32} />
            <span className="text-xl font-bold text-white tracking-wide">
              BugHead
            </span>
          </Link>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 md:gap-8">
          {!isLoggedIn &&
            menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          {!isLoggedIn && (
            <a
              href="https://github.com/kumarsameer23/bughead"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <Github size={20} />
            </a>
          )}
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="py-1.5 px-3 rounded-full font-medium text-red-400 border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="py-1.5 px-3 rounded-full font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="py-1.5 px-3 rounded-full font-medium text-blue-400 border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-neutral-900/90 backdrop-blur-md transition-all duration-300 ${
          isOpen ? "h-fit opacity-100" : "h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {!isLoggedIn &&
            menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-neutral-300 hover:text-white transition-colors duration-200 py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          {!isLoggedIn && (
            <a
              href="https://github.com/kumarsameer23/bughead"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2 py-2"
              onClick={() => setIsOpen(false)}
            >
              <Github size={20} />
              GitHub
            </a>
          )}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 rounded-lg font-medium text-red-400 border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="w-full text-center py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="w-full text-center py-2 rounded-lg font-medium text-blue-400 border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
