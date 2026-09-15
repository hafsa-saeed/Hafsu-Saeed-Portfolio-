# Hafsa Saeed — Full Stack Developer Portfolio & Backend Guide

A modern, highly animated personal portfolio website engineered with **React, TypeScript, Tailwind CSS, Motion**, and a full-stack **Node.js Express backend with Nodemailer** for direct Gmail delivery.

---

## 📋 Table of Contents

1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Quick Start & Terminal Commands](#-quick-start--terminal-commands)
3. [Gmail Setup for the Contact Form (Nodemailer)](#-gmail-setup-for-the-contact-form-nodemailer)
4. [How to Change Your Profile Photos](#-how-to-change-your-profile-photos)
5. [How to Replace the CV with Your Actual CV](#-how-to-replace-the-cv-with-your-actual-cv)
6. [How to Add, Edit, or Remove Projects](#-how-to-add-edit-or-remove-projects)
7. [How to Add or Edit Documents & Certificates](#-how-to-add-or-edit-documents--certificates)
8. [How to Update Social Links, Phone Numbers & Bio](#-how-to-update-social-links-phone-numbers--bio)
9. [Step-by-Step Deployment Guide for Railway.com](#-step-by-step-deployment-guide-for-railwaycom)
10. [Night Mode (Emerald Night Theme)](#-night-mode-emerald-night-theme)

---

## 🌟 Project Overview & Key Features

- **Emerald & White Visual Identity**: Custom luxury emerald styling (`#10b981`, `#059669`) with frosted glassmorphism cards.
- **Hardware-Accelerated Smooth Cursor Follower**: Stutter-free trailing circle powered by `requestAnimationFrame` and CSS `translate3d`.
- **Integrated Full-Stack Backend**: Express server handling `/api/contact` requests with Nodemailer to deliver visitor messages straight to `hafsasaeed1074@gmail.com`.
- **Interactive CV Viewer**: In-browser document sheet viewer, printable layout, and direct PDF download button.
- **Comprehensive Showcase**: Work experience milestones, academic qualifications, categorized skills with animated meters, personal hobbies, and verified certificates.

---

## 💻 Quick Start & Terminal Commands

Run these commands in your project terminal:

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Locally in Development Mode

```bash
npm run dev
```

- Starts the Express backend and Vite middleware concurrently on **`http://localhost:3000`**.
- Features instant hot-reloading and active backend API endpoints.

### 3. Build for Production

```bash
npm run build
```

- Compiles the React frontend into static assets in `dist/`.
- Compiles `server.ts` into a standalone CommonJS bundle in `dist/server.cjs`.

### 4. Run Production Build

```bash
npm run start
```

- Starts the production Node.js server from `dist/server.cjs` on port 3000.

---

## 📬 Gmail Setup for the Contact Form (Nodemailer)

When a visitor fills out the **Contact Me** form on your portfolio and clicks **"Send Message to Gmail"**, the backend automatically formats the email and sends it directly to **`hafsasaeed1074@gmail.com`**.

To allow Google to send emails through your Gmail account, you need a **16-character Google App Password**:

### Step 1: Generate an App Password

1. Log in to your Google Account at [https://myaccount.google.com/](https://myaccount.google.com/).
2. Navigate to **Security** (left sidebar).
3. Under _"How you sign in to Google"_, make sure **2-Step Verification** is turned **ON**.
4. Search for **"App passwords"** in the top search bar (or visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Under **App name**, type `Portfolio Contact Form` and click **Create**.
6. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`). **Copy this password**.

### Step 2: Add to your `.env` file

Create or edit your `.env` file in the root directory:

```env
GMAIL_USER=hafsasaeed1074@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
RECIPIENT_EMAIL=hafsasaeed1074@gmail.com
```

_(Replace `abcdefghijklmnop` with your actual 16-character app password without spaces)_.

> **Note**: Even if the App Password is not yet set up, the website safely accepts the message, logs it in the console, and confirms receipt to the user without crashing!

---

## 📸 How to Change Your Profile Photos

All personal images and avatars are centrally managed in `src/data/portfolioData.ts`.

### Option A: Using Your Own Image File

1. Put your image file inside the **`public/`** folder (e.g., rename it `my-photo.jpg` and place it in `public/my-photo.jpg`).
2. Open `src/data/portfolioData.ts`.
3. Locate `personalInfo`:
   ```typescript
   export const personalInfo = {
     name: 'Hafsa Saeed',
     avatarUrl: '/my-photo.jpg',     // <-- Updated photo
     heroAvatarUrl: '/my-photo.jpg', // <-- Updated photo
     ...
   };
   ```

### Option B: Using an Online Link (Cloudinary, Imgur, GitHub, LinkedIn)

Paste any high-resolution direct image URL:

```typescript
avatarUrl: 'https://your-image-host.com/profile.jpg',
heroAvatarUrl: 'https://your-image-host.com/profile.jpg',
```

---

## 📄 How to Replace the CV with Your Actual CV

There are two ways your CV is presented: as a **downloadable file** and as an **interactive on-screen sheet**.

### 1. Replacing the Downloadable PDF

1. Save your completed CV as a PDF file named **`Hafsa_Saeed_CV.pdf`**.
2. Replace the file located at:
   ```
   public/Hafsa_Saeed_CV.pdf
   ```
3. Whenever someone clicks **"Download CV (PDF)"**, browser downloads this exact file!

### 2. Updating the In-App CV Text & Sections

Open `src/data/portfolioData.ts` and edit the `cvData` object:

```typescript
export const cvData = {
  summary: "Your custom executive summary...",
  skillsList: [
    "Frontend: React, Next.js, Tailwind CSS",
    "Backend: Node.js, Express, REST APIs",
    ...
  ],
  education: [ ... ],
  experience: [ ... ],
  certifications: [ ... ],
};
```

These changes instantly reflect in the interactive CV viewer and in the print-to-paper version.

---

## 🚀 How to Add, Edit, or Remove Projects

All projects displayed in the **Featured Projects** grid are defined in `src/data/portfolioData.ts` under `projectsList`.

### To Add a New Project:

Add a new object to `projectsList`:

```typescript
{
  id: 'my-new-project',
  title: 'My Project Title',
  category: 'web', // Choose one: 'web' | 'ai' | 'data' | 'cms'
  description: 'Short 1-2 sentence overview shown on the card.',
  longDescription: 'Detailed breakdown visible in the popup modal.',
  tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
  image: 'https://images.unsplash.com/photo-...', // Or '/projects/my-screenshot.png'
  demoLink: 'https://my-live-demo-link.com',
  githubLink: 'https://github.com/your-username/repo-name',
  features: [
    'Feature 1: Real-time synchronization with WebSockets',
    'Feature 2: Role-based access control (Admin, User)',
    'Feature 3: Automated email notifications',
  ],
},
```

### To Edit Existing Projects:

Modify the `title`, `description`, `image`, `tags`, or `githubLink` directly inside `projectsList`.

---

## 📜 How to Add or Edit Documents & Certificates

Certificates in the **Docs & Credentials** section are stored in `src/data/portfolioData.ts` under `credentialsList`.

### To Add a Certificate:

```typescript
{
  id: 'cert-python-advanced',
  title: 'Advanced Python & Data Science',
  issuer: 'Coursera / Stanford Online',
  date: '2024',
  category: 'Specialization',
  credentialId: 'PY-984321',
  skillsLearned: ['NumPy', 'Pandas', 'Data Structures', 'Data Visualization'],
  imageThumbnail: 'https://images.unsplash.com/photo-...',
},
```

---

## 🔗 How to Update Social Links, Phone Numbers & Bio

Open `src/data/portfolioData.ts` and modify the `personalInfo` object:

```typescript
export const personalInfo = {
  name: "Hafsa Saeed",
  title: "BS Computer Science Student & Full Stack Web Developer",
  tagline:
    "Crafting responsive, high-performance web solutions with modern tools.",
  location: "Homelife Hostel, PAF Road, Mianwali, Punjab, Pakistan",
  phone1: "+92 3461617836",
  phone2: "+92 3290209836",
  email: "hafsasaeed192@gmail.com",

  socials: {
    linkedin: "https://www.linkedin.com/in/your-profile-url/",
    github: "https://github.com/your-github-username",
    twitter: "https://twitter.com/your-handle",
    email: "mailto:hafsasaeed192@gmail.com",
    whatsapp:
      "https://wa.me/923000000000?text=Hello%20Hafsa,%20I%20visited%20your%20portfolio!",
  },
};
```

---

## 🚂 Step-by-Step Deployment Guide for Railway.com

Railway is an excellent cloud platform to host full-stack Node.js + Vite applications with zero hassle:

### Step 1: Push Project to GitHub

1. Initialize git in your project (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio setup"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. Go to [Railway.com](https://railway.com/) and click **Login** (sign in with GitHub).
2. Click **"+ New Project"** -> Select **"Deploy from GitHub repo"**.
3. Choose your portfolio repository from the list.
4. Click **"Deploy Now"**.

### Step 3: Add Environment Variables in Railway

1. In your Railway dashboard, click on your deployed project card.
2. Go to the **Variables** tab.
3. Add the following variables:
   - `GMAIL_USER` = `hafsasaeed1074@gmail.com`
   - `GMAIL_APP_PASSWORD` = `<your-16-character-app-password>`
   - `RECIPIENT_EMAIL` = `hafsasaeed1074@gmail.com`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
4. Click **Save Changes** (Railway will automatically redeploy with your new secrets).

### Step 4: Generate a Public Domain

1. In the **Settings** tab of your Railway project, scroll to the **Networking** section.
2. Click **"Generate Domain"** (e.g., `hafsasaeed-portfolio.up.railway.app`).
3. You can also connect a custom domain (e.g. `hafsasaeed.com`) with free automatic SSL.

---

## 🌙 Night Mode (Emerald Night Theme)

The application includes an **Emerald Night** theme tailored to match the primary white-and-emerald brand aesthetic:

- Uses deep obsidian-emerald base tones (`#06120d`, `#071812`, `#081a13`) instead of generic grays.
- Vibrant emerald border highlights (`rgba(16, 185, 129, 0.25)`).
- Automatically persists your preference in browser `localStorage`.
- Toggle between Light and Night mode anytime using the sun/moon button in the top navigation bar.

---

_Enjoy your portfolio website! If you have any questions, feel free to update `src/data/portfolioData.ts` to customize any text, skill, or credential._
