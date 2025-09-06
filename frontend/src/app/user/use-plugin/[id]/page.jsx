// File: frontend/src/app/user/user-plugin/[id]/page.jsx
"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DotWave } from 'ldrs/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../../../components/Navbar';
import { Link as LinkIcon, Bug, User, ExternalLink } from 'lucide-react';

const WebsiteDetails = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!id || !storedToken) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [websiteRes, bugsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/websites/${id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
          axios.get(`http://localhost:5000/api/bugs/website/${id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
        ]);
        setWebsite(websiteRes.data);
        setBugs(bugsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
        toast.error(err.response?.data?.message || 'Failed to fetch data. ❌');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, storedToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <DotWave size="47" speed="1" color="#2563EB" />
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="container mx-auto mt-20 text-center">
          <h1 className="text-3xl font-bold text-red-500">Error</h1>
          <p className="mt-4 text-lg text-neutral-400">{error || "Website not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto mt-20">
        {/* Website Details Card */}
        <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
                <LinkIcon size={48} className="text-green-500" />
                <h1 className="text-3xl font-bold text-white">
                    {website.websiteUrl}
                </h1>
            </div>
            <div className="space-y-2">
                <p className="text-neutral-400">
                    <span className="font-semibold text-white">GitHub Repo:</span>{" "}
                    <a href={website.repoLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {website.repoLink} <ExternalLink size={14} className="inline-block" />
                    </a>
                </p>
                <p className="text-neutral-400">
                    <span className="font-semibold text-white">Website ID:</span>{" "}
                    {website._id}
                </p>
                {/* ✅ Display the Website User ID */}
                <p className="text-neutral-400">
                    <span className="font-semibold text-white">Website User ID:</span>{" "}
                    {website.userId}
                </p>
            </div>
        </div>

        {/* Reported Bugs Table */}
        <h2 className="text-2xl font-bold text-white mb-6">Reported Bugs</h2>
        {bugs.length > 0 ? (
            <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-700">
                        <thead className="bg-neutral-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Reported By</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Link</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-700">
                            {bugs.map(bug => (
                                <tr key={bug._id} className="hover:bg-neutral-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bug.title}</td>
                                    {/* ✅ Display the reporter's name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400 flex items-center gap-1">
                                        <User size={16} /> {bug.reporter.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}`}>
                                            {bug.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                                        <a href={bug.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                            View on GitHub <ExternalLink size={16} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <p className="text-center text-neutral-400 mt-10">No bugs have been reported for this website yet.</p>
        )}
      </div>
    </div>
  );
};

export default WebsiteDetails;
