# Hafsa Saeed — Portfolio & Private Admin CMS

A high-performance personal portfolio website and full **Admin CMS** for **Hafsa Saeed** (BS Computer Science Student & Full Stack Web Developer).

Featuring a luxury emerald aesthetic, hardware-accelerated animations, live project showcases, verified credentials, in-browser CV preview, and a **private `/admin` CMS** backed by **Supabase PostgreSQL** and **Cloudflare R2** for large 300MB+ demo video uploads without server body bottlenecks.

---

## 🚀 Key Upgrades in this Release

1. **Private `/admin` Management Panel**:
   - `/admin/login` (Real Supabase Email/Password Auth)
   - `/admin` (Metrics Dashboard, Storage & DB Status, One-click Sync)
   - `/admin/projects` (CRUD for projects, hero cover, screenshot gallery & demo video)
   - `/admin/credentials` (Certificates, DigiSkills credentials & PDF uploads)
   - `/admin/education` (Active semester, CGPA, graduation timeline, honors)
   - `/admin/experience` (Roles, companies, responsibilities & tech tags)
   - `/admin/skills` (Categories, proficiency percentages 0-100%, reordering)
   - `/admin/documents` (Active CV management, PDF replacement, transcripts)
   - `/admin/profile` (Bio, quote, phone numbers, location, social links, stats)
   - `/admin/messages` (Private contact form inquiries with 1-click Gmail replies)

2. **Large Video & Media Storage via Cloudflare R2**:
   - Zero file size bottlenecks on Vercel: large files do NOT pass through Vercel request bodies.
   - S3-compatible direct-to-R2 presigned upload pipeline.
   - Resumable **Multipart Direct Upload** for large 300MB+ video walkthrough files with real-time percentage, MB transfer, and chunk progress bars.
   - Native HTML5 `<video controls>` presentation preserving the exact existing emerald dark card aesthetics.

3. **Supabase PostgreSQL & Row-Level Security (RLS)**:
   - 10 relational tables: `projects`, `project_media`, `credentials`, `education`, `experience`, `skill_categories`, `skills`, `documents`, `personal_profile`, and `contact_messages`.
   - Public read policies for portfolio display.
   - Strict authenticated admin policies for write operations.
   - Private `contact_messages` accessible only to the authenticated admin.

---

## 🛠️ Step-by-Step Configuration Guide

### 1. Supabase Setup

1. Create a free account at [Supabase.com](https://supabase.com).
2. Click **New Project**, name it (e.g. `hafsa-portfolio`), and set a strong database password.
3. Once provisioned, go to **Project Settings** -> **API**:
   - Copy **Project URL** -> `VITE_SUPABASE_URL`
   - Copy **anon public key** -> `VITE_SUPABASE_ANON_KEY`
   - Copy **service_role secret key** (optional for backend server) -> `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database Tables & Schema

1. In your Supabase dashboard, open the **SQL Editor** from the left navigation.
2. Open the file `supabase-schema.sql` located in this repository.
3. Paste the entire content into the Supabase SQL Editor and click **Run**.
4. This script automatically:
   - Creates all 10 relational tables (`projects`, `project_media`, `credentials`, `education`, `experience`, `skill_categories`, `skills`, `documents`, `personal_profile`, `contact_messages`).
   - Enables Row-Level Security (RLS) on every table.
   - Configures public read policies and authenticated admin write policies.
   - Seeds all of Hafsa's initial real data (all 8 projects, credentials, education milestones, work experiences, and profile).

### 3. Supabase Authentication & Admin Account Setup

1. In Supabase, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**:
   - Email: `hafsasaeed1074@gmail.com` (or your preferred admin email)
   - Password: Choose a strong admin password
   - Auto Confirm User: Checked (Yes)
3. You can now use this email and password to log in at `/admin/login`.

### 4. Cloudflare R2 Storage Setup

1. Sign up or log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **R2** in the left sidebar.
3. Click **Create Bucket**:
   - Bucket Name: `hafsa-portfolio` (or your choice)
   - Location: Automatic
4. Click **Create Bucket**.

### 5. R2 Bucket Configuration (CORS & Public Access)

#### A. Enable Public Access (or Custom Domain)
- In your bucket settings, go to **Settings** -> **Public Access**.
- Click **Connect Domain** (e.g. `media.yourdomain.com`) or enable the **R2.dev subdomain** (`https://pub-xxxxxx.r2.dev`).
- Note this URL: it will be your `R2_PUBLIC_URL`.

#### B. Configure CORS
In bucket **Settings** -> **CORS Policy**, click **Add CORS policy** and paste:
```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://*.vercel.app",
      "https://your-custom-domain.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
*(The `ExposeHeaders: ["ETag"]` is essential so the browser can collect ETags for multipart video uploads).*

#### C. Create R2 API Tokens
- On the main R2 page, click **Manage R2 API Tokens**.
- Click **Create API Token**:
  - Permissions: **Object Read & Write**
  - Apply to: Specific bucket (`hafsa-portfolio`) or All buckets
  - TTL: Forever
- Copy:
  - **Account ID** -> `R2_ACCOUNT_ID`
  - **Access Key ID** -> `R2_ACCESS_KEY_ID`
  - **Secret Access Key** -> `R2_SECRET_ACCESS_KEY`

---

## 🔑 Required Environment Variables

Create a `.env` file (or set these in your **Vercel Project Settings -> Environment Variables**):

```env
# 1. Supabase (Database & Admin Auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Cloudflare R2 (Large 300MB+ Demo Videos, Images & PDFs)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=hafsa-portfolio
R2_PUBLIC_URL=https://pub-yourbucketid.r2.dev

# 3. Contact Inquiries & Notifications
RECIPIENT_EMAIL=hafsasaeed1074@gmail.com
GMAIL_USER=hafsasaeed1074@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

---

## 🚀 Vercel Deployment

This project is configured out-of-the-box for seamless Vercel deployment:

1. Push your repository to your private GitHub.
2. In [Vercel](https://vercel.com), click **Add New** -> **Project**.
3. Import your portfolio repository.
4. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, paste the keys from your `.env` (Supabase, R2, Gmail).
6. Click **Deploy**.
7. Vercel will build both the frontend and serverless API functions located in `/api/index.ts`. All `/api/*` routes and SPA rewrites (`vercel.json`) are automatically handled.

---

## 📹 Large Video Upload System (300MB+)

- **Direct-to-R2 Upload**: When you upload an actual demo video (e.g. 50MB, 300MB, or 1GB+) in `/admin/projects`:
  1. The browser requests an upload token from `/api/storage/multipart/init`.
  2. The video is chunked client-side into 6MB parts using standard browser `File.slice()`.
  3. Each chunk is PUT directly to Cloudflare R2 using presigned URLs.
  4. The Vercel serverless function only negotiates signatures — it never receives the large video binary payload, eliminating all Vercel 4.5MB request body limits and timeouts.
  5. The real-time progress bar shows upload percentage (`68%`), transferred megabytes (`204 MB / 300 MB`), and status.
  6. Once completed, the public R2 URL is saved in Supabase PostgreSQL and immediately accessible on the public project detail page.

---

## 🖥️ How to Use the `/admin` Panel

1. Go to `https://your-domain.com/admin/login` or click the subtle lock icon in the footer.
2. Log in with your Supabase admin email and password.
3. From the dashboard:
   - **Add Future Projects**: Click **Projects** -> **Add New Project**, fill in the details, upload your hero cover and screenshots, and upload your actual demo video.
   - **Update Semester & CGPA**: Go to **Education & CGPA**, click **Edit** on BS Computer Science, change semester to `7th Semester` or `8th Semester`, update your CGPA, and click save. The public website updates instantly.
   - **Replace CV**: Go to **Documents & CV**, upload your updated CV PDF, and click **Set as Active CV**. The public "Download CV" and embedded preview will point to the new file.
   - **Add Credentials**: Go to **Credentials**, upload the certificate scan or PDF, and tag the skills learned.
   - **Update Skills & Roles**: Go to **Skills** or **Experience** to adjust percentages or add new work experiences.
   - **View Inquiries**: Go to **Inquiries** to read contact messages with direct one-click Gmail response links.
