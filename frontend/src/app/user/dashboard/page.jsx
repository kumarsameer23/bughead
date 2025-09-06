// File: frontend/src/app/user/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { Bug, LayoutDashboard, Edit, Eye, EyeOff, X, ExternalLink, Link as LinkIcon, Code, Copy, Trash2, Globe } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Formik validation schema for editing user details
const EditProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name is too short!").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").notRequired(),
});

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const UserDashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [userWebsites, setUserWebsites] = useState([]);
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
            router.push('/login');
        } finally {
            setLoading(false);
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
            router.push("/login");
        } else {
            setIsAuthReady(true);
            fetchUser();
            fetchUserWebsites();
        }
    }, [storedUserId, storedToken]);

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
                    <motion.div 
                        className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
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
                    </motion.div>

                    {/* My Websites Card */}
                    <motion.div 
                        className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">My Websites</h2>
                            <Link href="/user/add-website" className="py-1.5 px-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                                <Globe size={20} /> Add Website
                            </Link>
                        </div>
                        {websitesLoading ? (
                             <div className="flex justify-center items-center h-48">
                                <DotWave size="47" speed="1" color="#2563EB" />
                             </div>
                        ) : userWebsites.length > 0 ? (
                            <ul className="space-y-4">
                                {userWebsites.map(website => (
                                    <motion.li
                                        key={website._id}
                                        className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:bg-neutral-700 transition-colors duration-200"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <LinkIcon size={24} className="text-blue-400" />
                                                <div>
                                                    <p className="font-semibold text-white">{website.websiteUrl}</p>
                                                    <p className="text-sm text-neutral-400">{website.repoLink}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/user/manage-websites/${website._id}`} className="p-2 rounded-full text-neutral-400 hover:bg-neutral-600 transition-colors" aria-label="Manage Website">
                                                    <Edit size={20} />
                                                </Link>
                                                <button onClick={() => openDeleteModal(website._id)} className="p-2 rounded-full text-red-400 hover:bg-neutral-600 transition-colors" aria-label="Delete Website">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-neutral-400 p-8">
                                <Globe size={64} className="mx-auto mb-4 text-neutral-600" />
                                <p className="mb-4">You have not added any websites yet.</p>
                                <Link
                                    href="/user/add-website"
                                    className="py-2.5 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Add Your First Website
                                </Link>
                            </div>
                        )}
                    </motion.div>
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