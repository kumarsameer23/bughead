// File: backend/router/bugRouter.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import verifyToken from "../middlewares/authMiddleware.js";
import Bug from "../models/BugModel.js";
import Website from "../models/WebsiteModel.js";

dotenv.config();

const router = express.Router();

// GET: Fetch bugs for a specific website
router.get("/by-website/:websiteId", verifyToken, async (req, res) => {
    try {
        const { websiteId } = req.params;
        const userId = req.userId;

        // Verify the user owns this website
        const website = await Website.findById(websiteId);
        if (!website || website.userId.toString() !== userId) {
            return res.status(403).json({ message: "Access denied. You do not have permission to view bugs for this website." });
        }

        const websiteBugs = await Bug.find({ website: websiteId }).populate('reporter', 'name email').lean();
        res.status(200).json(websiteBugs);
    } catch (err) {
        console.error("Error fetching bugs for website:", err.message);
        res.status(500).json({
            message: "Failed to fetch bugs for the specified website.",
            error: err.message,
        });
    }
});


// POST: Report a bug from the main dashboard (requires JWT)
router.post("/report-bug", verifyToken, async (req, res) => {
    const { websiteUrl, repoLink, title, body, reporterName } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const userId = req.userId;

    if (!GITHUB_TOKEN) {
        return res.status(500).json({ message: "GitHub token not configured." });
    }

    try {
        let website = await Website.findOne({ repoLink: repoLink });
        if (!website) {
            website = new Website({
                userId: userId,
                websiteUrl: websiteUrl,
                repoLink: repoLink,
            });
            await website.save();
        }

        const repoUrlParts = website.repoLink.split('/');
        const repoOwner = repoUrlParts[repoUrlParts.length - 2];
        const repoName = repoUrlParts[repoUrlParts.length - 1].replace('.git', '');

        const response = await axios.post(
            `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
            {
                title: title,
                body: `**Bug Report by:** ${reporterName}\n\n**Description:**\n${body}`,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        const newBug = new Bug({
            githubIssueId: response.data.number,
            title: title,
            reporter: userId,
            website: website._id,
            githubUrl: response.data.html_url,
            status: 'open',
        });
        await newBug.save();

        res.status(201).json({
            message: "Bug report successfully submitted to GitHub and saved.",
            issueUrl: response.data.html_url,
        });
    } catch (err) {
        console.error("Error submitting bug report:", err.response?.data || err.message);
        res.status(500).json({
            message: "Failed to submit bug report.",
            error: err.response?.data?.message || err.message,
        });
    }
});

// GET: Fetch bugs submitted by the logged-in user from the database
router.get("/my-bugs", verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userBugs = await Bug.find({ reporter: userId }).populate('website', 'repoLink').lean();
        res.status(200).json(userBugs);
    } catch (err) {
        console.error("Error fetching user-specific bugs:", err.message);
        res.status(500).json({
            message: "Failed to fetch your reported bugs.",
            error: err.message,
        });
    }
});

// GET: Fetch all bug reports from the database (for admin view)
router.get("/all-bugs", verifyToken, async (req, res) => {
    try {
        const allBugs = await Bug.find().populate('reporter', 'name email').populate('website', 'websiteUrl repoLink');
        res.status(200).json(allBugs);
    } catch (err) {
        console.error("Error fetching all bugs:", err.message);
        res.status(500).json({
            message: "Failed to fetch all bug reports.",
            error: err.message,
        });
    }
});

// POST: Public endpoint for plugin to submit bugs (no JWT required)
router.post("/plugin-report", async (req, res) => {
    const { websiteId, title, body } = req.body;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
        return res.status(500).json({ message: "GitHub token not configured." });
    }

    try {
        const website = await Website.findById(websiteId);
        if (!website) {
            return res.status(404).json({ message: "Website not found." });
        }
        
        const repoUrlParts = website.repoLink.split('/');
        const repoOwner = repoUrlParts[repoUrlParts.length - 2];
        const repoName = repoUrlParts[repoUrlParts.length - 1].replace('.git', '');

        const response = await axios.post(
            `https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
            {
                title: title,
                body: `**Bug Report by:** Plugin User\n\n**Description:**\n${body}`,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        const newBug = new Bug({
            githubIssueId: response.data.number,
            title: title,
            reporter: website.userId,
            website: website._id,
            githubUrl: response.data.html_url,
            status: 'open',
        });
        await newBug.save();

        res.status(201).json({
            message: "Bug report from plugin submitted successfully!",
            issueUrl: response.data.html_url,
        });
    } catch (err) {
        console.error("Error submitting plugin bug report:", err.response?.data || err.message);
        res.status(500).json({
            message: "Failed to submit plugin bug report.",
            error: err.response?.data?.message || err.message,
        });
    }
});

// GET: Fetch a single bug by its ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id).populate('reporter', 'name email').populate('website', 'websiteUrl repoLink');
        if (!bug) {
            return res.status(404).json({ message: "Bug report not found." });
        }
        res.status(200).json(bug);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;