"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, Zap, GitFork, Code, Mail } from "lucide-react";
import Navbar from "../components/Navbar";

// Reusable Feature Card with glow effect
const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="relative bg-neutral-900/70 rounded-xl p-8 shadow-lg border border-neutral-800 text-center transition-all duration-300
      before:absolute before:inset-0 before:rounded-xl before:bg-blue-500 before:opacity-0 before:transition-opacity before:duration-500
      hover:before:opacity-30"
  >
    <div className="flex justify-center relative z-10">{icon}</div>
    <h3 className="text-xl font-semibold text-white mt-4 relative z-10">{title}</h3>
    <p className="mt-2 text-neutral-400 relative z-10">{desc}</p>
  </motion.div>
);

const Homepage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  useEffect(() => {
    // Function to handle smooth scrolling
    const handleSmoothScroll = (event) => {
      const targetId = event.target.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for fixed navbar height
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Add event listeners to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Clean up event listeners on component unmount
    return () => {
      internalLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans">
      <Navbar />

      <main className="w-full">
        {/* Hero Section with centered text and background image */}
        <section
          id="home"
          className="relative min-h-screen w-full flex flex-col justify-center items-center text-center px-6"
          style={{
            backgroundImage: "url('/assets/hero3new.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          
          <div className="container mx-auto relative z-20">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-extrabold text-white leading-tight mt-20"
            >
              From Snippet to Solution. <br />
              <span className="text-blue-500">One Line of Code, Zero Bugs.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-neutral-300 max-w-lg mx-auto"
            >
              BugHead simplifies bug reporting. Just add a simple HTML snippet to your site, and let AI summarize, categorize, and log every bug directly to GitHub.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center mt-8"
            >
              <a
                href="#get-started"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="https://github.com/kumarsameer23/bughead"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-blue-600 px-6 py-3 rounded-full font-semibold text-white hover:bg-white hover:text-blue-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <GitFork size={18} /> View on GitHub
              </a>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Explaining the Pain Points */}
        <section id="features" className="relative py-24 bg-gradient-to-b from-black via-neutral-900 to-black">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-4xl font-bold text-center mb-16">
              The Problem with Bug Reports
            </h2>
            <p className="text-lg text-neutral-300 text-center max-w-3xl mx-auto mb-16">
              Dealing with messy, unorganized bug reports from users and testers is a major time sink for developers. BugHead solves this by providing clarity and automation.
            </p>
            <div className="grid md:grid-cols-3 gap-10">
              <FeatureCard
                icon={<Bot className="text-purple-500" size={40} />}
                title="AI-Powered Summarization"
                desc="Manually sorting through fragmented bug descriptions is inefficient. BugHead uses Gemini AI to instantly condense raw reports into clear, actionable, and professional issues."
              />
              <FeatureCard
                icon={<Zap className="text-yellow-500" size={40} />}
                title="Seamless GitHub Integration"
                desc="Stop switching between platforms. Every bug is logged as a GitHub issue automatically, complete with AI-enhanced context and a complete history."
              />
              <FeatureCard
                icon={<Code className="text-blue-500" size={40} />}
                title="Smart Categorization"
                desc="Triage time is valuable. Our system intelligently auto-tags reports into categories like UI, Logic, or Performance, so your team can focus on what matters most."
              />
            </div>
          </div>
        </section>

        {/* How It Works - The Simple Solution */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-black/95 via-blue-700/60 to-black/95">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-4xl font-bold text-center mb-16">
              The BugHead Solution
            </h2>
            <div className="grid gap-12 max-w-4xl mx-auto">
              {[
                {
                  step: 1,
                  title: "Add the Snippet",
                  desc: "Start by copying a single, tiny HTML snippet from your BugHead dashboard and pasting it directly into your website's code.",
                },
                {
                  step: 2,
                  title: "Users Report Bugs",
                  desc: "Users can now report bugs with a single click. BugHead automatically captures screenshots, browser info, and other vital context for you.",
                },
                {
                  step: 3,
                  title: "AI-Summarized & Logged",
                  desc: "The magic happens here. Our AI instantly summarizes the bug and logs it as a new issue on your GitHub repository, saving you hours of manual work.",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6"
                >
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {s.step}
                  </div>
                  <div className="bg-neutral-900/70 p-6 rounded-xl shadow-lg border border-neutral-800 flex-1">
                    <h3 className="text-xl font-semibold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-neutral-400">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Combined CTA and Footer Section */}
        <section
          ref={ref}
          id="get-started"
          className="relative w-full overflow-hidden flex flex-col justify-center items-center text-center px-6 py-24"
          style={{
            backgroundImage: "url('/assets/sectionnew.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Refined gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-900/40 to-black/90 z-10"></div>
          
          <div className="container mx-auto relative z-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 max-w-2xl mx-auto">
              Focus on Building. <br />
              <span className="text-blue-500">Leave the Bugs to BugHead.</span>
            </h2>
            <p className="text-neutral-200 mb-8 max-w-xl text-lg mx-auto">
              Automate your bug reporting workflow with a single snippet. Our AI handles the messy details, so you can focus on what matters.
            </p>
            <div>
              <a
                href="/signup"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-950 border-t border-neutral-800 py-10">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-12 text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold text-white">BugHead</h3>
              <p className="text-sm text-neutral-400 mt-1">
                &copy; 2025 BugHead. All rights reserved.
              </p>
            </div>
            <div>
              <a
                href="mailto:sameerkumar10122004@gmail.com"
                className="text-sm text-neutral-400 hover:text-white transition flex items-center gap-2"
              >
                <Mail size={16} /> sameerkumar10122004@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Homepage;
