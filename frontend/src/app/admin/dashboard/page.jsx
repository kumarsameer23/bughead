// File: frontend/src/app/admin/dashboard/page.jsx
"use client";
import React from "react";
import Navbar from "../../../components/Navbar";
import { UserCog, Code, Users, Bug, UserPlus, Link, Github } from "lucide-react"; // Updated icons
import NextLink from "next/link";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
      <Navbar />
      <div className="container mx-auto mt-20">
        <div className="flex items-center gap-4 mb-8">
          <UserCog size={48} className="text-emerald-500" />
          <h1 className="text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
        </div>

        <p className="text-lg text-neutral-400 mb-8">
          Welcome to the admin panel. Here you can manage all users and websites for BugHead.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card for Managing Users */}
          <NextLink href="/admin/manage-users" passHref>
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
              <Users size={64} className="text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Manage Users</h2>
              <p className="text-sm text-neutral-400 text-center">
                View, edit, or delete user accounts.
              </p>
            </div>
          </NextLink>

          {/* ✅ New Card for Managing Websites */}
          <NextLink href="/admin/manage-websites" passHref>
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
              <Link size={64} className="text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Manage Websites</h2>
              <p className="text-sm text-neutral-400 text-center">
                View, edit, and delete linked websites.
              </p>
            </div>
          </NextLink>
          
          {/* Card for Viewing Bugs */}
          <NextLink href="/dashboard/bugs" passHref>
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
              <Bug size={64} className="text-purple-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">View Bugs</h2>
              <p className="text-sm text-neutral-400 text-center">
                Check the status of reported issues on connected repositories.
              </p>
            </div>
          </NextLink>

          {/* Card for Github */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center justify-center p-8 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer">
              <Github size={64} className="text-neutral-300 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">My GitHub</h2>
              <p className="text-sm text-neutral-400 text-center">
                View your repositories and manage settings directly on GitHub.
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
