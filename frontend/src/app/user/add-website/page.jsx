// File: frontend/src/app/user/add-website/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { DotWave } from "ldrs/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../../components/Navbar";
import { Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AddWebsiteSchema = Yup.object().shape({
  websiteUrl: Yup.string()
    .url("Invalid URL")
    .required("Website URL is required"),
  repoLink: Yup.string()
    .url("Invalid URL")
    .required("GitHub repository link is required"),
});

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const AddWebsite = () => {
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!storedToken) {
      window.location.href = "/login";
    } else {
      setIsAuthReady(true);
    }
  }, [storedToken]);

  const addWebsiteForm = useFormik({
    initialValues: {
      websiteUrl: "",
      repoLink: "",
    },
    validationSchema: AddWebsiteSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await axios.post("http://localhost:5000/api/websites", values, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        toast.success("Website added successfully! ✅");
        resetForm();

        // Redirect to a plugin generation page with the new website's ID
        router.push(`/user/plugin-generation?websiteId=${res.data.websiteId}`);

      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add website. ❌");
        console.error("Error adding website:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isAuthReady) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-950">
            <DotWave size="47" speed="1" color="#2563EB" />
        </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto mt-20">
        <Link href="/user/dashboard" passHref>
          <span className="flex items-center gap-2 text-blue-500 hover:underline mb-8 cursor-pointer">
            <ArrowLeft size={20} /> Back to Dashboard
          </span>
        </Link>
        <motion.div
          className="flex flex-col items-center p-8 mx-auto max-w-2xl bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <LinkIcon size={64} className="text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Add New Website
          </h1>
          <p className="text-neutral-400 mb-8 text-center">
            Register your website to start tracking bugs.
          </p>
          <form onSubmit={addWebsiteForm.handleSubmit} className="w-full">
            <div className="mb-6">
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-neutral-400 mb-2">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                onChange={addWebsiteForm.handleChange}
                onBlur={addWebsiteForm.handleBlur}
                value={addWebsiteForm.values.websiteUrl}
                className="py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
              {addWebsiteForm.errors.websiteUrl && addWebsiteForm.touched.websiteUrl && (<p className="text-xs text-red-500 mt-2">{addWebsiteForm.errors.websiteUrl}</p>)}
            </div>
            <div className="mb-6">
              <label htmlFor="repoLink" className="block text-sm font-medium text-neutral-400 mb-2">GitHub Repository Link</label>
              <input
                type="url"
                id="repoLink"
                name="repoLink"
                onChange={addWebsiteForm.handleChange}
                onBlur={addWebsiteForm.handleBlur}
                value={addWebsiteForm.values.repoLink}
                className="py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
              {addWebsiteForm.errors.repoLink && addWebsiteForm.touched.repoLink && (<p className="text-xs text-red-500 mt-2">{addWebsiteForm.errors.repoLink}</p>)}
            </div>
            <button
              disabled={addWebsiteForm.isSubmitting}
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
            >
              {addWebsiteForm.isSubmitting ? (<DotWave size="35" speed="1" color="white" />) : ("Add Website")}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddWebsite;