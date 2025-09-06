// File: frontend/src/app/admin/manage-websites/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import {
  Trash2,
  Edit,
  X,
  ExternalLink,
  Globe,
  PlugIcon,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

// Validation schema for the update form
const UpdateWebsiteSchema = Yup.object().shape({
  websiteUrl: Yup.string()
    .url("Invalid URL")
    .required("Website URL is required"),
  repoLink: Yup.string()
    .url("Invalid URL")
    .required("GitHub repository link is required"),
});

const ManageWebsites = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [deletingWebsite, setDeletingWebsite] = useState(null);

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Function to fetch all websites from the backend
  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/websites", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setWebsites(res.data);
    } catch (err) {
      toast.error("Failed to fetch websites. ❌");
      console.error("Error fetching websites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storedToken) {
      toast.error("You are not authorized to view this page.");
      setTimeout(() => (window.location.href = "/login"), 1500);
      return;
    }
    fetchWebsites();
  }, [storedToken]);

  // Formik for updating website details
  const updateForm = useFormik({
    initialValues: {
      websiteUrl: "",
      repoLink: "",
    },
    validationSchema: UpdateWebsiteSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.put(
          `http://localhost:5000/api/websites/${editingWebsite._id}`,
          values,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        toast.success("Website updated successfully! ✅");
        setEditingWebsite(null);
        fetchWebsites(); // Re-fetch data to show the changes
      } catch (err) {
        toast.error("Failed to update website. ❌");
        console.error("Error updating website:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = (website) => {
    setEditingWebsite(website);
    updateForm.setValues({
      websiteUrl: website.websiteUrl,
      repoLink: website.repoLink,
    });
  };

  const handleDelete = async () => {
    if (!deletingWebsite) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/websites/${deletingWebsite._id}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      toast.success("Website deleted successfully! ✅");
      setDeletingWebsite(null);
      fetchWebsites(); // Re-fetch data
    } catch (err) {
      toast.error("Failed to delete website. ❌");
      console.error("Error deleting website:", err);
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
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto mt-20">
        <div className="flex items-center gap-4 mb-8">
          <Globe size={48} className="text-emerald-500" />
          <h1 className="text-3xl font-bold text-white">Manage Websites</h1>
        </div>
        <p className="text-lg text-neutral-400 mb-8">
          View, edit, or delete websites linked to your BugHead account.
        </p>
        <NextLink href="/admin/add-website" passHref>
          <button className="py-2 px-4 mb-8 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Add New Website
          </button>
        </NextLink>

        {websites.length > 0 ? (
          <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-700">
                <thead className="bg-neutral-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Website URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Repository Link
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {websites.map((website) => (
                    <tr
                      key={website._id}
                      className="hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <a
                          href={website.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          {website.websiteUrl} <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        <a
                          href={website.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          {website.repoLink} <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/user/use-plugin/${website._id}`}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            <PlugIcon size={20} />
                          </Link>
                          <button
                            onClick={() => handleEdit(website)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => setDeletingWebsite(website)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-neutral-400 mt-10">
            No websites linked yet.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editingWebsite && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Update Website</h2>
              <button
                onClick={() => setEditingWebsite(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={updateForm.handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="websiteUrl"
                  className="block text-sm mb-1 text-neutral-400"
                >
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={updateForm.values.websiteUrl}
                  onChange={updateForm.handleChange}
                  className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                {updateForm.errors.websiteUrl &&
                  updateForm.touched.websiteUrl && (
                    <p className="text-xs text-red-500 mt-1">
                      {updateForm.errors.websiteUrl}
                    </p>
                  )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="repoLink"
                  className="block text-sm mb-1 text-neutral-400"
                >
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  id="repoLink"
                  name="repoLink"
                  value={updateForm.values.repoLink}
                  onChange={updateForm.handleChange}
                  className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:ring-blue-500 focus:border-blue-500"
                />
                {updateForm.errors.repoLink && updateForm.touched.repoLink && (
                  <p className="text-xs text-red-500 mt-1">
                    {updateForm.errors.repoLink}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWebsite(null)}
                  className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateForm.isSubmitting}
                  className="py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateForm.isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWebsite && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
          <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-xs text-center">
            <h2 className="text-lg font-bold mb-4 text-white">Are you sure?</h2>
            <p className="text-neutral-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingWebsite(null)}
                className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default ManageWebsites;
