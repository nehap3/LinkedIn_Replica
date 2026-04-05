# LinkedIn Replica

A full-stack professional networking platform built to help students connect, find internship/job opportunities, and build their professional presence.

## 🚀 Tech Stack

- **Frontend Framework:** React (built seamlessly with Vite)
- **UI Library:** Material-UI (MUI) providing a clean, responsive, modern LinkedIn-like aesthetic
- **State Management:** Zustand
- **Backend/Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth
- **Routing:** React Router v6

## ✨ Features

- **Authentication System:** Secure email/password login and registration using Firebase Auth.
- **Protected Routing:** Unauthenticated users are properly restricted from viewing private feeds.
- **User Profiles:** Display and manage detailed profiles, including headlines, about sections, experience, and education.
- **News Feed:** View network activity, render timestamps, and create text posts.
- **Connections Network:** Discover users, send connection invitations, and maintain a professional network.
- **Job Postings:** Browse recommended roles and post custom job/internship opportunities.
- **Real-Time Messaging:** Direct chat engine enabling connected peers to interact privately.
- **Events & Notifications:** Explore user-created events and get alerted on pending connection interactions.
- **Global Search:** Easily find other users and jobs seamlessly through the sticky navigation bar.

## 💻 Local Setup

1. **Clone the repository** (if not already local)
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Firebase:**
   Create a `.env` file in the root directory and supply your Firebase configuration keys generated from the Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key_here"
   VITE_FIREBASE_AUTH_DOMAIN="your_firebaseapp_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Visit `http://localhost:5173`** in your browser to view the application!

## 🚀 Deployment

This application supports seamless deployment to **Netlify** or **GitHub Pages**.

1. Create an optimized production build:
   ```bash
   npm run build
   ```
2. The `dist/` directory can be drag-and-dropped into Netlify Drop, or you can deploy automatically by pushing to GitHub and linking your repo to Netlify's CI/CD.

> **Security Note:** Ensure you have adequately configured your Firebase application's Firestore and Auth Security rules directly within your Firebase Dashboard before pushing to production.
