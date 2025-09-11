"use client";

import React, { useState } from "react";
import { Bug, Github, Mail, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-neutral-900/50 py-3 px-4 md:px-12 border-b border-neutral-800 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <a href="#" className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105">
          <Bug className="text-blue-500 animate-pulse-slow" size={28} />
          <span className="text-xl font-bold text-white tracking-wide">BugHead</span>
        </a>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-white hover:text-blue-400 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-white hover:text-blue-400 transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="https://github.com/kumarsameer23/bughead"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            <Github size={20} />
            <span className="hidden lg:inline">GitHub Repo</span>
          </a>
          <a
            href="/login"
            className="py-1 px-4 rounded-full font-medium text-blue-400 border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            Login
          </a>
          <a
            href="/signup"
            className="py-1 px-4 rounded-full font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden absolute top-[60px] left-0 w-full bg-neutral-900/90 py-4 px-6 border-b border-neutral-800 transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col gap-4 items-center">
          <a href="#features" className="text-white hover:text-blue-400 transition-colors duration-200" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-white hover:text-blue-400 transition-colors duration-200" onClick={() => setIsOpen(false)}>How It Works</a>
          <a href="#contact" className="text-white hover:text-blue-400 transition-colors duration-200" onClick={() => setIsOpen(false)}>Contact</a>
          <a href="https://github.com/kumarsameer23/bughead" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors duration-200 flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Github size={20} />
            GitHub
          </a>
          <a href="/login" className="py-2 px-6 w-full text-center rounded-full font-medium text-blue-400 border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200" onClick={() => setIsOpen(false)}>Login</a>
          <a href="/signup" className="py-2 px-6 w-full text-center rounded-full font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md" onClick={() => setIsOpen(false)}>Sign Up</a>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
