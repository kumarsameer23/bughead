// File: frontend/src/app/user/plugin-generation/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { DotWave } from 'ldrs/react';
import { Copy, Code, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const PluginGenerator = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

        if (!storedToken || !storedUser) {
            window.location.href = "/login";
        } else {
            const user = JSON.parse(storedUser);
            setUserId(user._id);
            setLoading(false);
        }
    }, []);

    const pluginScript = userId
        ? `<script id="bughead-plugin-script" data-user-id="${userId}" src="https://yourbugheaddomain.com/bughead-plugin.js"></script>`
        : `<!-- User ID not found. Please log in. -->`;

    const handleCopy = () => {
        if (userId) {
            navigator.clipboard.writeText(pluginScript)
                .then(() => toast.success("Plugin script copied to clipboard!"))
                .catch(() => toast.error("Failed to copy script. Please try again."));
        } else {
            toast.error("User ID not found. Cannot generate script.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-950">
                <DotWave size="47" speed="1" color="#2563EB" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <div className="container mx-auto mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <Code size={48} className="text-purple-500" />
                    <h1 className="text-3xl font-bold text-white">Generate Your Plugin</h1>
                </div>

                <Link href="/user/dashboard" passHref>
                    <span className="flex items-center gap-2 text-blue-500 hover:underline mb-8 cursor-pointer">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </span>
                </Link>

                <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800 p-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Your Unique Plugin Script</h2>
                    <p className="text-neutral-400 mb-6">
                        Copy the code below and paste it into the `&lt;head&gt;` section of any website you want to track bugs on.
                    </p>
                    <div className="relative bg-neutral-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre className="text-emerald-300"><code>{pluginScript}</code></pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-2 rounded-lg text-neutral-400 hover:bg-neutral-700 transition-colors"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PluginGenerator;