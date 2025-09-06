// File: frontend/src/app/admin/bugs/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { Bug, LayoutDashboard, ExternalLink } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import Link from "next/link";

const AllBugs = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!storedToken) {
            toast.error("You are not authorized to view this page.");
            setTimeout(() => window.location.href = "/login", 1500);
            return;
        }
        
        const fetchAllBugs = async () => {
            setLoading(true);
            try {
                // ✅ Call the new admin-specific API endpoint
                const res = await axios.get("http://localhost:5000/api/bugs/all-bugs", {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
                setBugs(res.data);
                toast.success("All bugs fetched successfully! ✅");
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch all bugs. ❌");
                console.error("Error fetching all bugs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBugs();
    }, [storedToken]);

    return (
        <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <Bug size={48} className="text-purple-500" />
                    <h1 className="text-3xl font-bold text-white">
                        All Reported Bugs (Admin View)
                    </h1>
                </div>

                <Link href="/admin/dashboard" passHref>
                    <span className="flex items-center gap-2 text-blue-500 hover:underline mb-8 cursor-pointer">
                        <LayoutDashboard size={20} /> Back to Dashboard
                    </span>
                </Link>

                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <DotWave size={40} speed={1} color="#60a5fa" />
                    </div>
                ) : bugs.length > 0 ? (
                    <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-700">
                                <thead className="bg-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Reported By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Website</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Link</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-700">
                                    {bugs.map(bug => (
                                        <tr key={bug._id} className="hover:bg-neutral-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bug.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{bug.reporter.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                <a href={bug.website.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                    {bug.website.repoLink} <ExternalLink size={14} />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}`}>
                                                    {bug.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                                <a href={bug.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                    View <ExternalLink size={16} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <p className="text-center text-neutral-400 mt-10">
                            No bugs have been reported yet.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default AllBugs;
