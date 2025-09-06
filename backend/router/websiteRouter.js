// File: backend/router/websiteRouter.js
import express from "express";
import Website from "../models/WebsiteModel.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET: Fetch a single website by ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) {
            return res.status(404).json({ message: "Website not found." });
        }
        // Ensure the logged-in user owns this website
        if (website.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Access denied." });
        }
        res.status(200).json(website);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST: Add new website
router.post("/", verifyToken, async (req, res) => {
  try {
    const { websiteUrl, repoLink } = req.body;
    const userId = req.userId; 

    if (!userId || !websiteUrl || !repoLink) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newWebsite = new Website({ userId, websiteUrl, repoLink });
    await newWebsite.save();

    res.status(201).json({ 
        message: "Website added successfully!",
        websiteId: newWebsite._id 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: All websites (for admin panel)
router.get("/", async (req, res) => {
  try {
    const websites = await Website.find().sort({ createdAt: -1 });
    res.json(websites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: New route to dynamically find a repo from a website URL
router.get("/repo", async (req, res) => {
  try {
    const { websiteUrl } = req.query;
    if (!websiteUrl) {
      return res.status(400).json({ message: "Website URL is required" });
    }

    const website = await Website.findOne({ websiteUrl });
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    const repoUrlParts = website.repoLink.split('/');
    const repoOwner = repoUrlParts[repoUrlParts.length - 2];
    const repoName = repoUrlParts[repoUrlParts.length - 1].replace('.git', '');

    res.status(200).json({ repoOwner, repoName });

  } catch (err) {
    console.error("Error fetching repository:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: New route to get all websites for a specific user
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const websites = await Website.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(websites);
    } catch (err) {
        console.error("Error fetching websites for user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// DELETE: Delete a website by ID
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);
        if (!website) {
            return res.status(404).json({ message: "Website not found." });
        }
        if (website.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Access denied." });
        }
        await website.deleteOne();
        res.status(200).json({ message: "Website deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;