# LinkedIn Replica

A full-stack professional networking platform built to help students connect, find internship and job opportunities, and build their professional presence.

## 🌐 Live Demo

**Explore the application here:**
https://wonderful-biscuit-847ffc.netlify.app/

> **Demo Login:**
> https://wonderful-biscuit-847ffc.netlify.app/login

## 🚀 Tech Stack

* **Frontend Framework:** React (built with Vite)
* **UI Library:** Material-UI (MUI)
* **State Management:** Zustand
* **Backend/Database:** Firebase (Firestore)
* **Authentication:** Firebase Auth
* **Routing:** React Router v6

## ✨ Features

* **Authentication System:** Secure email/password login and registration using Firebase Auth.
* **Protected Routing:** Unauthenticated users are restricted from accessing private pages.
* **User Profiles:** Manage professional profiles with headline, about, experience, and education details.
* **News Feed:** Create posts and view network activity with timestamps.
* **Connections Network:** Discover users, send connection requests, and build your professional network.
* **Job Postings:** Browse recommended jobs and publish internship or job opportunities.
* **Real-Time Messaging:** Chat privately with connected users.
* **Events & Notifications:** Create events and receive notifications for connection requests.
* **Global Search:** Search for users and job postings from the navigation bar.

## 💻 Local Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and add your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY="your_api_key_here"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebaseapp_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## 🚀 Deployment

The project is deployed on **Netlify**.

**Live URL:** https://wonderful-biscuit-847ffc.netlify.app/

To deploy your own version:

1. Build the project:

   ```bash
   npm run build
   ```
2. Deploy the generated `dist/` folder to Netlify, or connect your GitHub repository for automatic CI/CD deployment.
