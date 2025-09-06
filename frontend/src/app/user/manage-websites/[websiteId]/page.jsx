// File: src/app/user/manage-websites/[websiteId]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import Navbar from "../../../../../components/Navbar";
import { Bug, Link as LinkIcon, Code, Copy, ExternalLink, Globe, Trash2, Edit, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const WebsiteManagementPage = ({ params }) => {
    const { websiteId } = params;
    const router = useRouter();
    const [website, setWebsite] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!storedUserId || !storedToken) {
            router.push("/login");
            return;
        }

        const fetchWebsiteData = async () => {
            try {
                // Fetch the website details
                const websiteRes = await axios.get(`http://localhost:5000/api/websites/${websiteId}`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                setWebsite(websiteRes.data);

                // Fetch bugs for this specific website
                const bugsRes = await axios.get(`http://localhost:5000/api/bugs/by-website/${websiteId}`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                setBugs(bugsRes.data);
            } catch (err) {
                toast.error("Failed to fetch website data. ❌");
                console.error("Error fetching website data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (websiteId) {
            fetchWebsiteData();
        }
    }, [websiteId, storedUserId, storedToken, router]);
    
    const getPluginScript = () => {
        if (!website) return "// Add a website to generate your personalized plugin script.";
        return `<script>
  window.bugHeadConfig = {
    userId: "${storedUserId}",
    websiteId: "${website._id}"
  };
</script>
<script src="https://your-domain.com/path/to/dist/main.js"></script>`;
    };
    
    const handleCopyScript = () => {
        const script = getPluginScript();
        navigator.clipboard.writeText(script).then(() => {
            toast.success("Plugin script copied to clipboard! 📋");
        }).catch(err => {
            toast.error("Failed to copy script. ❌");
            console.error("Copy error:", err);
        });
    };
    
    const openDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDeleteWebsite = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/websites/${websiteId}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            toast.success("Website deleted successfully! ✅");
            router.push('/user/dashboard'); // Redirect back to the main dashboard
        } catch (err) {
            toast.error("Failed to delete website. ❌");
            console.error("Error deleting website:", err);
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-950">
                <DotWave size="47" speed="1" color="#2563EB" />
            </div>
        );
    }
    
    if (!website) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-neutral-950 text-neutral-200 font-sans">
                <Navbar />
                <h1 className="text-2xl font-bold">Website Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <div className="container mx-auto mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <Globe size={48} className="text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">
                        Manage {website.websiteUrl}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Website Details Card */}
                    <motion.div 
                        className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">Website Details</h2>
                            <button onClick={openDeleteModal} className="p-2 rounded-full text-red-400 hover:bg-neutral-600 transition-colors" aria-label="Delete Website">
                                <Trash2 size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-neutral-400">Website URL</p>
                                <p className="text-lg text-white font-medium break-all">
                                    <a href={website.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{website.websiteUrl} <ExternalLink size={16} className="inline-block" /></a>
                                </p>
                            </div>
                            <div>
                                <p className="text-neutral-400">GitHub Repository</p>
                                <p className="text-lg text-white font-medium break-all">
                                    <a href={website.repoLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{website.repoLink} <ExternalLink size={16} className="inline-block" /></a>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Plugin Generation Card */}
                    <motion.div 
                        className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">Embed Plugin</h2>
                            <button onClick={handleCopyScript} className="p-2 rounded-full text-blue-400 hover:bg-neutral-600 transition-colors">
                                <Copy size={24} />
                            </button>
                        </div>
                        <p className="text-neutral-400 mb-4">Copy and paste this script tag into the `<head>` section of your website's HTML to enable bug reporting.</p>
                        <div className="relative p-4 bg-neutral-800 rounded-lg border border-neutral-700 font-mono text-sm overflow-x-auto">
                            <pre className="whitespace-pre-wrap break-words">{getPluginScript()}</pre>
                        </div>
                    </motion.div>
                </div>

                {/* Bug Reports Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Bug size={24} /> Reported Bugs for This Website
                        </h2>
                    </div>
                    {bugs.length > 0 ? (
                        <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-700">
                                    <thead className="bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Reporter</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-700">
                                        {bugs.map(bug => (
                                            <tr key={bug._id} className="hover:bg-neutral-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bug.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{bug.reporter?.name || "N/A"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}`}>
                                                        {bug.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                                    <a href={bug.githubUrl} target="_blank" rel="noopener noreferrer">
                                                        View on GitHub <ExternalLink size={16} className="inline-block" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center text-neutral-400 p-8 bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800">
                            <Bug size={64} className="mx-auto mb-4 text-neutral-600" />
                            <p className="mb-4">No bug reports have been submitted for this website yet.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {isDeleteModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
                    <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                            <button onClick={() => setIsDeleteModalVisible(false)} className="text-neutral-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-neutral-400 mb-6">Are you sure you want to delete this website? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsDeleteModalVisible(false)}
                                className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteWebsite}
                                className="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteManagementPage;