// File: frontend/src/app/admin/add-website/page.jsx
"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { DotWave } from "ldrs/react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../../components/Navbar";
import { Bug } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Validation schema for the form using Yup
const AddWebsiteSchema = Yup.object().shape({
  userId: Yup.string()
    .min(2, "User ID is too short!")
    .required("User ID is required"),
  websiteUrl: Yup.string()
    .url("Invalid URL")
    .required("Website URL is required"),
  repoLink: Yup.string()
    .url("Invalid URL")
    .required("GitHub repository link is required"),
});

const AddWebsite = () => {
  const searchParams = useSearchParams();
  const repoLinkFromQuery = searchParams.get('repoLink');
  const token = localStorage.getItem('token');
  
  const addWebsiteForm = useFormik({
    initialValues: {
      userId: "",
      websiteUrl: "",
      repoLink: "",
    },
    validationSchema: AddWebsiteSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const submissionData = {
          userId: values.userId,
          websiteUrl: values.websiteUrl,
          repoLink: values.repoLink,
        };

        const res = await axios.post("http://localhost:5000/api/websites", submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Website added successfully! ✅");
        resetForm();
        window.location.href = "/user/dashboard";
      } catch (err) {
        console.error("Error adding website:", err.response?.data || err.message);
        toast.error(
          err.response?.data?.message || "Failed to add website. Please try again. ❌"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Pre-fill the form with the repoLink from the URL query and the userId from local storage
  useEffect(() => {
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (storedUserId) {
        addWebsiteForm.setFieldValue('userId', storedUserId);
    }
    if (repoLinkFromQuery) {
      addWebsiteForm.setFieldValue('repoLink', decodeURIComponent(repoLinkFromQuery));
    }
  }, [repoLinkFromQuery]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 relative overflow-hidden">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-md w-full backdrop-blur-md bg-neutral-900/80 border border-neutral-800 rounded-xl shadow-2xl animate-fade-in-up mt-20">
        <div className="p-4 sm:p-7">
          <div className="text-center mb-6">
            <Bug size={48} className="mx-auto mb-2 text-blue-500" />
            <h1 className="block text-2xl font-bold text-white">
              Add a New Website
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Fill in the details for the new website.
            </p>
          </div>

          <form onSubmit={addWebsiteForm.handleSubmit} noValidate>
            <div className="grid gap-y-4">
              {/* User ID Input (hidden from the user) */}
              <div>
                <label htmlFor="userId" className="block text-sm mb-2 text-white">
                  User ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    onChange={addWebsiteForm.handleChange}
                    onBlur={addWebsiteForm.handleBlur}
                    value={addWebsiteForm.values.userId}
                    className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    readOnly // ✅ Prevents user from editing
                  />
                </div>
                {addWebsiteForm.errors.userId &&
                  addWebsiteForm.touched.userId && (
                    <p className="text-xs text-red-500 mt-2">
                      {addWebsiteForm.errors.userId}
                    </p>
                  )}
              </div>
              
              {/* Website URL Input */}
              <div>
                <label htmlFor="websiteUrl" className="block text-sm mb-2 text-white">
                  Website URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    onChange={addWebsiteForm.handleChange}
                    onBlur={addWebsiteForm.handleBlur}
                    value={addWebsiteForm.values.websiteUrl}
                    className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
                {addWebsiteForm.errors.websiteUrl &&
                  addWebsiteForm.touched.websiteUrl && (
                    <p className="text-xs text-red-500 mt-2">
                      {addWebsiteForm.errors.websiteUrl}
                    </p>
                  )}
              </div>

              {/* GitHub Repo Link Input */}
              <div>
                <label htmlFor="repoLink" className="block text-sm mb-2 text-white">
                  GitHub Repository Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="repoLink"
                    name="repoLink"
                    onChange={addWebsiteForm.handleChange}
                    onBlur={addWebsiteForm.handleBlur}
                    value={addWebsiteForm.values.repoLink}
                    className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
                {addWebsiteForm.errors.repoLink &&
                  addWebsiteForm.touched.repoLink && (
                    <p className="text-xs text-red-500 mt-2">
                      {addWebsiteForm.errors.repoLink}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                disabled={addWebsiteForm.isSubmitting}
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
              >
                {addWebsiteForm.isSubmitting ? (
                  <DotWave size="35" speed="1" color="white" />
                ) : (
                  "Add Website"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWebsite;
