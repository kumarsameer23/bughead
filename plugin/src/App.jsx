// File: plugin/src/App.jsx
import React, { useState, useEffect } from "react";
import { Bug, X } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const BugReportSchema = Yup.object().shape({
  websiteUrl: Yup.string()
    .url("Invalid URL")
    .required("Website URL is required"),
  repoLink: Yup.string()
    .url("Invalid URL")
    .required("Repository Link is required"),
  title: Yup.string()
    .min(5, "Title is too short")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description is too short")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  browser: Yup.string().required("Browser is required"),
  os: Yup.string().required("Operating System is required"),
});

const PluginApp = ({ ownerId }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [reporterId, setReporterId] = useState("");

  useEffect(() => {
    const scriptTag = document.getElementById("bughead-plugin-script");
    if (scriptTag) {
      setReporterId(scriptTag.getAttribute("data-user-id"));
    }
  }, []);

  const bugReportForm = useFormik({
    initialValues: {
      websiteUrl: "",
      repoLink: "",
      title: "",
      description: "",
      category: "UI",
      browser: "Chrome",
      os: "Windows",
    },
    validationSchema: BugReportSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!reporterId) {
        toast.error("Plugin misconfigured: Missing user ID.");
        setSubmitting(false);
        return;
      }

      try {
        const bugTitle = `[${values.category} Bug] on ${values.browser} (${values.os}): ${values.title}`;

        await axios.post("http://localhost:5000/api/bugs/plugin-report", {
          ...values,
          title: bugTitle,
          reporterId: reporterId,
        });

        toast.success("Bug report submitted successfully! ✅");
        setFormVisible(false);
        resetForm();
      } catch (error) {
        toast.error("Failed to submit bug report. ❌");
        console.error("Error submitting bug report:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <button id="bughead-plugin-button" onClick={() => setFormVisible(true)}>
        <Bug size={24} />
      </button>

      {formVisible && (
        <div
          id="bughead-plugin-modal"
          className={formVisible ? "visible" : ""}
          onClick={(e) => {
            if (e.target.id === "bughead-plugin-modal") {
              setFormVisible(false);
            }
          }}
        >
          <div id="bughead-plugin-modal-content">
            <button
              id="bughead-close-btn"
              onClick={() => setFormVisible(false)}
            >
              <X size={24} />
            </button>
            <h3>Report a Bug</h3>
            <form onSubmit={bugReportForm.handleSubmit}>
              <div className="form-field-container">
                <label htmlFor="websiteUrl">Website URL</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={bugReportForm.values.websiteUrl}
                  onChange={bugReportForm.handleChange}
                  onBlur={bugReportForm.handleBlur}
                  required
                />
                {bugReportForm.errors.websiteUrl &&
                  bugReportForm.touched.websiteUrl && (
                    <p className="text-xs text-red-500 mt-1">
                      {bugReportForm.errors.websiteUrl}
                    </p>
                  )}
              </div>
              <div className="form-field-container">
                <label htmlFor="repoLink">GitHub Repo Link</label>
                <input
                  type="url"
                  id="repoLink"
                  name="repoLink"
                  value={bugReportForm.values.repoLink}
                  onChange={bugReportForm.handleChange}
                  onBlur={bugReportForm.handleBlur}
                  required
                />
                {bugReportForm.errors.repoLink &&
                  bugReportForm.touched.repoLink && (
                    <p className="text-xs text-red-500 mt-1">
                      {bugReportForm.errors.repoLink}
                    </p>
                  )}
              </div>
              <div className="form-field-container">
                <label htmlFor="title">Issue Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={bugReportForm.values.title}
                  onChange={bugReportForm.handleChange}
                  required
                />
                {bugReportForm.errors.title && bugReportForm.touched.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {bugReportForm.errors.title}
                  </p>
                )}
              </div>
              <div className="form-field-container">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={bugReportForm.values.description}
                  onChange={bugReportForm.handleChange}
                  required
                />
                {bugReportForm.errors.description &&
                  bugReportForm.touched.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {bugReportForm.errors.description}
                    </p>
                  )}
              </div>
              <div className="form-field-container">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={bugReportForm.values.category}
                  onChange={bugReportForm.handleChange}
                  required
                >
                  <option value="UI">UI / Visual</option>
                  <option value="Functionality">Functionality / Logic</option>
                  <option value="Performance">Performance</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
                {bugReportForm.errors.category &&
                  bugReportForm.touched.category && (
                    <p className="text-xs text-red-500 mt-1">
                      {bugReportForm.errors.category}
                    </p>
                  )}
              </div>
              <div className="form-field-container">
                <label htmlFor="browser">Browser</label>
                <select
                  id="browser"
                  name="browser"
                  value={bugReportForm.values.browser}
                  onChange={bugReportForm.handleChange}
                  required
                >
                  <option value="Chrome">Chrome</option>
                  <option value="Firefox">Firefox</option>
                  <option value="Safari">Safari</option>
                  <option value="Edge">Edge</option>
                  <option value="Other">Other</option>
                </select>
                {bugReportForm.errors.browser &&
                  bugReportForm.touched.browser && (
                    <p className="text-xs text-red-500 mt-1">
                      {bugReportForm.errors.browser}
                    </p>
                  )}
              </div>
              <div className="form-field-container">
                <label htmlFor="os">Operating System</label>
                <select
                  id="os"
                  name="os"
                  value={bugReportForm.values.os}
                  onChange={bugReportForm.handleChange}
                  required
                >
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                </select>
                {bugReportForm.errors.os && bugReportForm.touched.os && (
                  <p className="text-xs text-red-500 mt-1">
                    {bugReportForm.errors.os}
                  </p>
                )}
              </div>
              <button type="submit" disabled={bugReportForm.isSubmitting}>
                {bugReportForm.isSubmitting
                  ? "Submitting..."
                  : "Submit Bug Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PluginApp;
