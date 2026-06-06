# BugHead 🐛

BugHead is an intelligent, user-centric bug-tracking ecosystem built for modern website owners. It bridges the gap between chaotic client-side user feedback and structured developer workflows. By embedding a dynamically generated, lightweight client plugin into any live application, website owners can gather user reports automatically inside a centralized dashboard and triage them directly into GitHub Issues using an advanced, built-in AI summarization engine.

## 🚀 Live Application
Explore the deployment live on Vercel: [BugHead App](https://bughead-green.vercel.app/)

---

## 📸 Project Screenshots

<img width="1876" height="826" alt="image" src="https://github.com/user-attachments/assets/2d37d2e1-9427-4b25-a938-e116b93b114a" />

---

## 🧠 Smart AI Integration & Bug Summarization

The core strength of BugHead is its intelligent backend processing pipeline. Instead of flooding your GitHub repository with raw, unorganized, or duplicate text from end-users, BugHead leverages an LLM layer to clean and optimize every submission:

* **AI-Powered Bug Summarization:** When a visitor submits a bug via the widget, the backend captures the raw text and pipes it into an AI layer. The AI automatically parses the description, generates a concise, professional title, and extracts a structured, markdown-ready summary detailing the exact problem.
* **Automated Reproduction Steps:** The AI extracts or infers logical steps to reproduce the issue based on the user's feedback, formatting it cleanly into a checklist for developers.
* **Deduplication & Intelligent Labeling:** The pipeline analyzes the intent of incoming text to prevent duplicate tracking, tracks user sentiment, and automatically tags severity metrics (e.g., `[High]`, `[UI/UX]`) into your GitHub labels.
* **Context Harvesting:** BugHead automatically couples this AI-generated summary with harvested technical metadata—including browser versions, operating system layouts, and viewport specifications—creating the ultimate developer payload.

---

## ✨ Core Functionality & Features

### 1. Unified Dashboard Workflow
* **Owner-Centric Hub:** A streamlined dashboard providing quick access to metrics, registered web domains, and user profile configurations.
* **Seamless Site Provisioning:** Owners link their web URL and destination GitHub repository. The backend pairs these entries securely against the authenticated user account.

### 2. Embedded Client Plugin Component
* **Dynamic Generation:** BugHead constructs a customized, highly specific JavaScript plugin snippet directly on the `user/manage-websites/[id]/page.jsx` route containing unique `userId` and `websiteId` parameters.
* **Instant Injection:** Website owners copy and paste this lightweight script onto their parent applications to immediately render an interactive bug reporter button for their end-users.

### 3. Automated External Issue Syncing
* **Real-time GitHub Triage:** Submitting a bug through the embedded client fires a structured object to BugHead's public REST endpoint. The backend processes the text via AI and synchronously opens a fully documented issue ticket inside the destination repository via the GitHub REST API.

---

## 🛠️ Architecture & Tech Stack

BugHead relies on a decoupled, highly responsive architecture built with the **MERN Stack**:

* **Frontend:** Next.js (App Router), React, Tailwind CSS, and smooth layout animations configured via Framer Motion.
* **Backend:** Node.js server powered by Express.js API routing.
* **Database:** MongoDB Document Store managed via Mongoose schemas for flexible object reference maps (`User -> Websites -> Bugs`).
* **Authentication:** Secure hybrid protection using Google OAuth alongside JSON Web Tokens (JWT) for route protection.
* **Bundler Architecture:** Vite / Parcel compile optimization for the standalone injection bundle.

---

## 📁 Repository Structure

The code is strictly compartmentalized to maintain isolated development layers:

```text
├── FRONTEND/          # Next.js web application (Dashboard UI, Management, Profiles)
│   ├── src/app/       # App-router structures containing (auth) groups, user panels
│   └── components/    # Globally shared presentation layers (Navbar, Widgets)
├── BACKEND/           # ExpressJS Server & REST API Architecture
│   ├── middlewares/   # Token authentication validators (authMiddleware.js)
│   ├── models/        # Database document modeling (UserModel, WebsiteModel, BugModel)
│   └── router/        # Segmented endpoint handlers mapping backend routes
└── PLUGIN/            # Isolated standalone React client inject workspace
    ├── src/           # Component layout logic rendering the host site widget button
    └── dist/          # Compiled, distribution-ready CSS/JS artifacts for distribution
