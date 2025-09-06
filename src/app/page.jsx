// File: frontend/src/app/page.jsx
"use client";
import React from "react";
import Link from "next/link";
import { Bug, UserPlus, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" },
  tap: { scale: 0.95 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-neutral-950 text-neutral-200 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-8 z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto p-12 rounded-2xl shadow-2xl backdrop-blur-lg bg-neutral-900/70 border border-neutral-800"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Bug size={80} strokeWidth={1.5} className="mb-6 text-blue-500 animate-pulse-slow" />
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold mb-4 text-white tracking-tight"
            variants={itemVariants}
          >
            Welcome to BugHead
          </motion.h1>
          <motion.p
            className="text-xl mb-10 max-w-2xl font-light text-neutral-400"
            variants={itemVariants}
          >
            The ultimate platform for streamlining bug reports directly to your GitHub repository.
            Automate, track, and collaborate with ease.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 mt-8"
            variants={containerVariants}
          >
            <Link href="/signup" passHref>
              <motion.button
                className="py-4 px-10 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-300 flex items-center gap-3 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <UserPlus size={24} />
                Sign Up
              </motion.button>
            </Link>
            <Link href="/login" passHref>
              <motion.button
                className="py-4 px-10 rounded-lg font-semibold bg-neutral-700 text-neutral-200 hover:bg-neutral-600 transition duration-300 flex items-center gap-3 shadow-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <User size={24} />
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
