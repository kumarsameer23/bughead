// File: frontend/src/app/user/dashboard/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { Bug, LayoutDashboard, Edit, Eye, EyeOff, X, ExternalLink, Link as LinkIcon, Trash2, Code } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

// Formik validation schema for editing user details
const EditProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name is too short!").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").notRequired(),
});

const BugReportSchema = Yup.object().shape({
    websiteUrl: Yup.string().url("Invalid URL").required("Website URL is required"),
    repoLink: Yup.string().url("Invalid URL").required("Repository Link is required"),
    title: Yup.string().min(5, "Title is too short").required("Title is required"),
    description: Yup.string().min(10, "Description is too short").required("Description is required"),
    category: Yup.string().required("Category is required"),
    browser: Yup.string().required("Browser is required"),
    os: Yup.string().required("Operating System is required"),
});

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [isBugFormVisible, setIsBugFormVisible] = useState(false);
    const [reportedBugs, setReportedBugs] = useState([]);
    const [userWebsites, setUserWebsites] = useState([]);
    const [bugsLoading, setBugsLoading] = useState(false);
    const [websitesLoading, setWebsitesLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [websiteToDelete, setWebsiteToDelete] = useState(null);

    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${storedUserId}`, { headers: { Authorization: `Bearer ${storedToken}` } });
            setUser(res.data);
            editForm.setValues({
                name: res.data.name,
                email: res.data.email,
                password: "",
            });
            toast.success("User data fetched successfully! ✅");
        } catch (err) {
            toast.error("Failed to fetch user data. ❌");
            console.error("Error fetching user:", err);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchReportedBugs = async () => {
        setBugsLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/bugs/my-bugs", {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            setReportedBugs(res.data);
        } catch (err) {
            toast.error("Failed to fetch reported bugs. ❌");
            console.error("Error fetching reported bugs:", err);
        } finally {
            setBugsLoading(false);
        }
    };
    
    const fetchUserWebsites = async () => {
        setWebsitesLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/websites/user/${storedUserId}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUserWebsites(res.data);
        } catch (err) {
            toast.error("Failed to fetch your websites. ❌");
            console.error("Error fetching websites:", err);
        } finally {
            setWebsitesLoading(false);
        }
    };
    
    const handleDeleteWebsite = async (websiteId) => {
        try {
            await axios.delete(`http://localhost:5000/api/websites/${websiteId}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            toast.success("Website deleted successfully! ✅");
            fetchUserWebsites();
            setIsDeleteModalVisible(false);
            setWebsiteToDelete(null);
        } catch (err) {
            toast.error("Failed to delete website. ❌");
            console.error("Error deleting website:", err);
        }
    };
    
    const openDeleteModal = (websiteId) => {
        setWebsiteToDelete(websiteId);
        setIsDeleteModalVisible(true);
    };

    useEffect(() => {
        if (!storedUserId || !storedToken) {
            window.location.href = "/login";
        } else {
            setIsAuthReady(true);
        }
    }, [storedUserId, storedToken]);
    
    useEffect(() => {
      if (isAuthReady) {
        fetchUser();
        fetchReportedBugs();
        fetchUserWebsites();
      }
    }, [isAuthReady]);

    const editForm = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: EditProfileSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await axios.put(`http://localhost:5000/api/users/${storedUserId}`, values, {
                  headers: { Authorization: `Bearer ${storedToken}` }
                });
                toast.success("Profile updated successfully! ✅");
                setUser(res.data.user);
                setIsEditing(false);
            } catch (err) {
                toast.error("Failed to update profile. ❌");
                console.error("Error updating profile:", err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const bugReportForm = useFormik({
      initialValues: {
        websiteUrl: '',
        repoLink: '',
        title: '',
        description: '',
        category: 'UI',
        browser: 'Chrome',
        os: 'Windows',
      },
      validationSchema: BugReportSchema,
      onSubmit: async (values, { setSubmitting, resetForm }) => {
        try {
          const bugTitle = `[${values.category} Bug] on ${values.browser} (${values.os}): ${values.title}`;
          const res = await axios.post('http://localhost:5000/api/bugs/report-bug', {
            websiteUrl: values.websiteUrl,
            repoLink: values.repoLink,
            title: bugTitle,
            body: values.description,
            reporterName: user.name,
          }, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          
          toast.success("Bug report submitted successfully! ✅");
          setIsBugFormVisible(false);
          resetForm();
          fetchReportedBugs();
        } catch (error) {
          toast.error("Failed to submit bug report. ❌");
          console.error("Error submitting bug report:", error);
        } finally {
          setSubmitting(false);
        }
      },
    });


    if (loading || !isAuthReady) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-neutral-950">
                <DotWave size="47" speed="1" color="#2563EB" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-neutral-950 text-neutral-200 font-sans">
                <Navbar />
                <h1 className="text-2xl font-bold">User Not Found</h1>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <div className="container mx-auto mt-20">
                <div className="flex items-center gap-4 mb-8">
                    <LayoutDashboard size={48} className="text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">
                        Welcome, {user.name}!
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Profile Card */}
                    <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">
                                My Profile
                            </h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <Edit size={24} />
                            </button>
                        </div>
                        {!isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-neutral-400">Name</p>
                                    <p className="text-lg text-white font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-400">Email</p>
                                    <p className="text-lg text-white font-medium">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={editForm.handleSubmit}>
                                <div className="space-y-4">
                                    <div className="form-field-container">
                                        <label htmlFor="name" className="block text-sm mb-1 text-neutral-400">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={editForm.values.name}
                                            onChange={editForm.handleChange}
                                            className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {editForm.errors.name && editForm.touched.name && (<p className="text-xs text-red-500 mt-1">{editForm.errors.name}</p>)}
                                    </div>
                                    <div className="form-field-container">
                                        <label htmlFor="email" className="block text-sm mb-1 text-neutral-400">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={editForm.values.email}
                                            onChange={editForm.handleChange}
                                            className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {editForm.errors.email && editForm.touched.email && (<p className="text-xs text-red-500 mt-1">{editForm.errors.email}</p>)}
                                    </div>
                                    <div className="form-field-container">
                                        <label htmlFor="password" className="block text-sm mb-1 text-neutral-400">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={passwordHidden ? "password" : "text"}
                                                id="password"
                                                name="password"
                                                value={editForm.values.password}
                                                onChange={editForm.handleChange}
                                                className="w-full p-2 pr-10 rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPasswordHidden(!passwordHidden)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400"
                                            >
                                                {passwordHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {editForm.errors.password && editForm.touched.password && (<p className="text-xs text-red-500 mt-1">{editForm.errors.password}</p>)}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.isSubmitting}
                                        className="py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* My Websites Section */}
                    <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">
                                My Websites
                            </h2>
                            <Link href="/admin/add-website">
                                <button
                                    className="py-1.5 px-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <LinkIcon size={20} /> Add Website
                                </button>
                            </Link>
                        </div>
                        {websitesLoading ? (
                           <div className="flex justify-center items-center h-48">
                                <DotWave size="47" speed="1" color="#2563EB" />
                           </div>
                        ) : userWebsites.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-700">
                                    <thead className="bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Website URL</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">GitHub Repo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-700">
                                        {userWebsites.map(website => (
                                            <tr key={website._id} className="hover:bg-neutral-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                    <a href={website.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                                        {website.websiteUrl} <ExternalLink size={16} />
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                    <a href={website.repoLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {website.repoLink}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button 
                                                      onClick={() => openDeleteModal(website._id)}
                                                      className="text-red-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        ) : (
                             <div className="text-center text-neutral-400 p-8">
                                 <LinkIcon size={64} className="mx-auto mb-4 text-neutral-600" />
                                 <p className="mb-4">You have not added any websites yet.</p>
                                 <Link href="/admin/add-website" passHref>
                                     <button
                                         className="py-2.5 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                     >
                                         Add a Website
                                     </button>
                                 </Link>
                             </div>
                        )}
                    </div>
                </div>

                {/* My Reported Bugs Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Bug size={24} /> My Reported Bugs
                        </h2>
                        <button
                            onClick={() => setIsBugFormVisible(true)}
                            className="py-1.5 px-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <Bug size={20} /> Report New Bug
                        </button>
                    </div>
                    {bugsLoading ? (
                       <div className="flex justify-center items-center h-48">
                            <DotWave size="47" speed="1" color="#2563EB" />
                       </div>
                    ) : reportedBugs.length > 0 ? (
                         <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-700">
                                    <thead className="bg-neutral-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Website</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-700">
                                        {reportedBugs.map(bug => (
                                            <tr key={bug._id} className="hover:bg-neutral-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bug.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                                                    {bug.website ? bug.website.repoLink : "N/A"}
                                                </td>
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
                             <p className="mb-4">You have not reported any bugs yet.</p>
                             <button
                                 onClick={() => setIsBugFormVisible(true)}
                                 className="py-2.5 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                             >
                                 Report a Bug
                             </button>
                         </div>
                    )}
                </div>
            </div>
             {isBugFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
                    <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Report a Bug</h2>
                            <button onClick={() => setIsBugFormVisible(false)} className="text-neutral-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={bugReportForm.handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="websiteUrl" className="block text-sm mb-1 text-neutral-400">Website URL</label>
                                <input
                                    type="url"
                                    id="websiteUrl"
                                    name="websiteUrl"
                                    value={bugReportForm.values.websiteUrl}
                                    onChange={bugReportForm.handleChange}
                                    onBlur={bugReportForm.handleBlur}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {bugReportForm.errors.websiteUrl && bugReportForm.touched.websiteUrl && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.websiteUrl}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="repoLink" className="block text-sm mb-1 text-neutral-400">GitHub Repo Link</label>
                                <input
                                    type="url"
                                    id="repoLink"
                                    name="repoLink"
                                    value={bugReportForm.values.repoLink}
                                    onChange={bugReportForm.handleChange}
                                    onBlur={bugReportForm.handleBlur}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {bugReportForm.errors.repoLink && bugReportForm.touched.repoLink && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.repoLink}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm mb-1 text-neutral-400">Issue Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={bugReportForm.values.title}
                                    onChange={bugReportForm.handleChange}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {bugReportForm.errors.title && bugReportForm.touched.title && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.title}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm mb-1 text-neutral-400">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={bugReportForm.values.description}
                                    onChange={bugReportForm.handleChange}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {bugReportForm.errors.description && bugReportForm.touched.description && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.description}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm mb-1 text-neutral-400">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={bugReportForm.values.category}
                                    onChange={bugReportForm.handleChange}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="UI">UI / Visual</option>
                                    <option value="Functionality">Functionality / Logic</option>
                                    <option value="Performance">Performance</option>
                                    <option value="Security">Security</option>
                                    <option value="Other">Other</option>
                                </select>
                                {bugReportForm.errors.category && bugReportForm.touched.category && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.category}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="browser" className="block text-sm mb-1 text-neutral-400">Browser</label>
                                <select
                                    id="browser"
                                    name="browser"
                                    value={bugReportForm.values.browser}
                                    onChange={bugReportForm.handleChange}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="Chrome">Chrome</option>
                                    <option value="Firefox">Firefox</option>
                                    <option value="Safari">Safari</option>
                                    <option value="Edge">Edge</option>
                                    <option value="Other">Other</option>
                                </select>
                                {bugReportForm.errors.browser && bugReportForm.touched.browser && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.browser}</p>)}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="os" className="block text-sm mb-1 text-neutral-400">Operating System</label>
                                <select
                                    id="os"
                                    name="os"
                                    value={bugReportForm.values.os}
                                    onChange={bugReportForm.handleChange}
                                    className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="Windows">Windows</option>
                                    <option value="macOS">macOS</option>
                                    <option value="Linux">Linux</option>
                                    <option value="Android">Android</option>
                                    <option value="iOS">iOS</option>
                                    <option value="Other">Other</option>
                                </select>
                                {bugReportForm.errors.os && bugReportForm.touched.os && (<p className="text-xs text-red-500 mt-1">{bugReportForm.errors.os}</p>)}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={bugReportForm.isSubmitting}
                                    className="py-2.5 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                                >
                                    {bugReportForm.isSubmitting ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isDeleteModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
                    <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-sm text-center">
                        <h2 className="text-lg font-bold mb-4 text-white">Are you sure?</h2>
                        <p className="text-neutral-400 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalVisible(false)}
                                className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteWebsite(websiteToDelete)}
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

export default UserDashboard;
