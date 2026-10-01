-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR HAFSA SAEED PORTFOLIO & ADMIN CMS
-- ==============================================================================

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'fullstack',
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT,
  github_url TEXT,
  video_url TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Project Media Table (for individual heroes, multiple screenshots, and large demo videos)
CREATE TABLE IF NOT EXISTS public.project_media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('hero', 'screenshot', 'video', 'document')),
  url TEXT NOT NULL,
  r2_key TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  display_order INT NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Credentials & Certificates Table
CREATE TABLE IF NOT EXISTS public.credentials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  skills_learned JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  image_thumbnail TEXT NOT NULL,
  file_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id TEXT PRIMARY KEY,
  degree TEXT NOT NULL,
  institute TEXT NOT NULL,
  year TEXT NOT NULL,
  grade TEXT NOT NULL,
  status TEXT NOT NULL,
  semester TEXT,
  cgpa TEXT,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  key_responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  icon_name TEXT NOT NULL DEFAULT 'Briefcase',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id TEXT REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  name TEXT NOT NULL,
  level INT NOT NULL DEFAULT 80,
  icon TEXT,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Documents / CV Table
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'cv',
  file_url TEXT NOT NULL,
  r2_key TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  is_active_cv BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Personal Profile Table
CREATE TABLE IF NOT EXISTS public.personal_profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  titles JSONB NOT NULL DEFAULT '[]'::jsonb,
  bio TEXT NOT NULL,
  quote TEXT NOT NULL,
  quote_author TEXT NOT NULL,
  email TEXT NOT NULL,
  phone1 TEXT NOT NULL,
  phone2 TEXT NOT NULL,
  location TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  religion TEXT NOT NULL,
  nationality TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  profile_image TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  languages JSONB NOT NULL DEFAULT '[]'::jsonb,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Contact Messages Table (Private to Admin)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  delivered_via_smtp BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public READ policies for portfolio presentation
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on project_media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Allow public read access on credentials" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public read access on personal_profile" ON public.personal_profile FOR SELECT USING (true);

-- Authenticated ADMIN write policies (create, update, delete)
CREATE POLICY "Allow admin all access on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on project_media" ON public.project_media FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on credentials" ON public.credentials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on skill_categories" ON public.skill_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all access on personal_profile" ON public.personal_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact Messages Security:
-- Anyone can insert an inquiry
CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
-- ONLY authenticated admins can SELECT, UPDATE, or DELETE messages
CREATE POLICY "Allow admin select on contact_messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update on contact_messages" ON public.contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete on contact_messages" ON public.contact_messages FOR DELETE TO authenticated USING (true);

-- ==============================================================================
-- INITIAL SEED DATA MIGRATION
-- ==============================================================================

-- Seed Personal Profile
INSERT INTO public.personal_profile (id, name, titles, bio, quote, quote_author, email, phone1, phone2, location, age, gender, religion, nationality, marital_status, profile_image, resume_url, languages, socials, stats, goals)
VALUES (
  'main',
  'Hafsa Saeed',
  '["BS Computer Science Student", "Full Stack Web Developer", "AI-Powered Dev Specialist", "Tech Enthusiast & Learner"]'::jsonb,
  'Motivated Computer Science Student maintaining a 3.71 CGPA. Passionate about Web development, adapting to emerging modern technologies, and leveraging AI tools to accelerate software development.',
  'The expert in anything was once a beginner.',
  'Helen Hayes',
  'hafsasaeed192@gmail.com',
  '0327-5535987',
  '0319-8114339',
  'Homelife Hostel, PAF Road, Mianwali, Punjab, Pakistan',
  '21 Years Old',
  'Female',
  'Islam',
  'Pakistani',
  'Single',
  '/my-photo.jpg',
  '/Hafsa_Saeed_CV.pdf',
  '[{"name": "Urdu", "level": "Native Speaker"}, {"name": "English", "level": "Proficient Professional"}]'::jsonb,
  '{"github": "https://github.com/hafsa-saeed", "linkedin": "https://www.linkedin.com/in/hafsa-saeed-90b53b2a6?utm_source=share_via&utm_content=profile&utm_medium=member_android", "twitter": "https://twitter.com/#", "email": "mailto:hafsasaeed192@gmail.com", "whatsapp": "https://wa.me/923461617836"}'::jsonb,
  '[{"label": "Semester Active", "value": "6th", "suffix": " Sem", "desc": "BS Computer Science"}, {"label": "Tech Stack & Tools", "value": "15", "suffix": "+", "desc": "Languages & Frameworks"}, {"label": "Academic Grade", "value": "A+", "suffix": " Grade", "desc": "Top Matric & Pre-Med"}, {"label": "Certificates & Courses", "value": "4", "suffix": "+", "desc": "DigiSkills & Automation"}]'::jsonb,
  '["Continuously advance skills in full stack programming, modern web frameworks, and AI workflows.", "Solve impactful real-world challenges through clean code, data analytics, and responsive design.", "Collaborate with open-source creators and contribute to progressive tech communities.", "Excel in academic BS CS coursework while engineering practical commercial software."]'::jsonb
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- Seed Education
INSERT INTO public.education (id, degree, institute, year, grade, status, semester, cgpa, highlights, display_order)
VALUES
('bs-cs', 'BS Computer Science', 'Superior Group of Colleges, Mianwali', 'Sep 2023 – 2027', 'Maintaining 3.71 CGPA', 'In Progress (2 Semesters Remaining)', '6th Semester', '3.71', '["Currently pursuing 6th Semester with strong focus on software engineering.", "Core courses: Data Structures & Algorithms, Database Systems, Web Development, Object-Oriented Programming (C/C++).", "Expected degree completion: End of 2027 with honors."]'::jsonb, 1),
('fsc', 'FSC Pre-Medical', 'Superior Group of Colleges, Mianwali', 'Completed in 2023', '848 / 1100 (Grade A)', 'Completed with Distinction', 'Graduated', '848/1100', '["Graduated with High Grade A (848/1100 marks).", "Developed analytical problem-solving skills, discipline, and scientific inquiry before transitioning to computing."]'::jsonb, 2),
('matric', 'Matriculation (Science)', 'Govt. Girls Higher Secondary School Kundian', 'Completed in 2021', '1074 / 1100 (Grade A+)', 'Top Academic Honors', 'Graduated', '1074/1100', '["Exceptional academic score of 1074 out of 1100 marks (Grade A+).", "Demonstrated academic excellence in mathematics, physics, and science disciplines."]'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Experience
INSERT INTO public.experience (id, company, role, duration, type, description, key_responsibilities, technologies, icon_name, display_order)
VALUES
('sts-networking', 'STS (Success Training System)', 'Networking Specialist & Intern', 'June 2023 – December 2023', '6 Months Practical Experience', 'Worked as a networker for 6 months, gaining extensive hands-on experience in managing enterprise network setups, hardware diagnostics, and team collaboration.', '["Configured and maintained local area networks (LAN), routers, switches, and client workstations.", "Diagnosed and resolved network connectivity glitches, IP conflicts, and hardware bottlenecks.", "Collaborated cross-functionally with senior IT specialists on system updates and performance monitoring.", "Cultivated rigorous time management, technical communication, and procedural troubleshooting."]'::jsonb, '["Network Configuration", "Troubleshooting", "LAN / Routing", "Hardware Diagnostics", "Time Management"]'::jsonb, 'Network', 1),
('dream-house-teaching', 'Dream House School System', 'Computer Science & General Instructor', 'July 2024 – December 2024', 'Educational Mentorship', 'Delivered interactive lessons, inspiring students to appreciate computer fundamentals, digital literacy, and disciplined study habits.', '["Delivered engaging educational curricula focused on basic computing, logical reasoning, and teamwork.", "Fostered an inclusive, high-encouragement classroom atmosphere supporting diverse student learning speeds.", "Designed visual presentations and practical assessments using modern office automation software.", "Refined public speaking, mentorship, patience, and empathetic communication."]'::jsonb, '["Instructional Delivery", "Digital Literacy", "MS Office Presentation", "Classroom Leadership"]'::jsonb, 'BookOpen', 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Credentials
INSERT INTO public.credentials (id, title, issuer, date, credential_id, skills_learned, category, image_thumbnail, display_order)
VALUES
('cred-wp', 'WordPress Development Certification', 'DigiSkills Training Program (Govt of Pakistan)', 'Certified 2023', 'DS-WP-89241', '["WordPress CMS", "Custom Theme Styling", "Plugin Configuration", "WooCommerce Setup", "SEO Basics"]'::jsonb, 'Web Development', '/credentials/wordpress-certificate.jpg', 1),
('cred-da', 'Data Analytics & Business Development', 'DigiSkills Training Program', 'Certified 2023', 'DS-DABD-44109', '["Business Metrics", "Data Exploration", "Excel Power Query", "Statistical Visuals", "Strategic Planning"]'::jsonb, 'Data Science & Analytics', '/credentials/data-analytics-certificate.jpg', 2),
('cred-office', 'Office Automation & Productivity Suite', 'Computer Science Institute Mianwali', 'Completed 2022', 'OA-MIA-7712', '["MS Word Advanced Formatting", "Excel Formulas & Pivot Tables", "PowerPoint Storytelling", "Speed Typing"]'::jsonb, 'Office Automation', '/credentials/office-automation-certificate.jpg', 3),
('cred-matric', 'Matriculation Academic Honors (Grade A+)', 'Board of Intermediate & Secondary Education', 'Awarded 2021', 'BISE-1074-DIST', '["1074/1100 Marks (97.6%)", "Mathematics Excellence", "Physics & Chemistry Distinction"]'::jsonb, 'Academic Distinction', '/credentials/matric-result-card.jpg', 4),
('cred-fsc', 'FSC Academic Honors (Grade A)', 'Board of Intermediate & Secondary Education', 'Awarded 2023', 'BISE-848-DIST', '["848/1100 Marks (97.6%)", "Mathematics Excellence", "Physics & Chemistry Distinction"]'::jsonb, 'Academic Distinction', '/credentials/fsc-result-card.jpg', 5),
('cred-bc', 'BS Computer Science Academic Honors (Maintaining 3.71 CGPA)', 'Superior Group of Colleges, Mianwali', 'Expected degree completion: End of 2027', '6th semester continue', '["3.71 CGPA (Maintaining) / 4.00", "Computer Science", "C, C++, Python, Data Structures, Web Development, Networking, Operating system, Database Management, AI Tools"]'::jsonb, 'Academic Distinction', '/credentials/bs-cs-5th-sem-transcript.jpg', 6)
ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (id, slug, title, category, description, long_description, image, tags, features, live_url, github_url, video_url, featured, display_order)
VALUES
(
  'proj-1',
  'cognisphere',
  'CogniSphere - Enterprise Multi-Tenant SaaS L&D Platform',
  'fullstack',
  'Architected an enterprise multi-tenant learning management platform with strict data isolation, role-based access control (Super Admin, HR Admin, Learner), AI-driven quiz generation, and real-time MRR analytics.',
  'CogniSphere is a multi-tenant Learning & Development SaaS solution engineered to provide fully isolated branded portals for organizations. Features a Super Admin billing & MRR engine, an HR Admin panel equipped with an AI Quiz Architect and dynamic Certificate Generator, and an intuitive Learner portal for seamless course execution.',
  '/projects/cognisphere/hero.jpg',
  '["Next.js", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Multi-Tenancy", "OpenAI / AI Engine", "Recharts"]'::jsonb,
  '["Strict multi-tenant architecture with custom subdomains and isolated database schemas per organization", "Super Admin dashboard tracking Monthly Recurring Revenue (MRR), tier quotas, system broadcasts, and audit logs", "AI Quiz Architect generating automated assessments directly from course content and custom prompts", "Automated Certificate Engine featuring dynamic token interpolation ({learner_name}, {course_name}) and digital signature verification", "Role-based portal access with dedicated course creation, drag-and-drop modules, and learner progress analytics"]'::jsonb,
  '#demo',
  'https://github.com/hafsa-saeed/CongniSphere-Tanent-Project-.git',
  '/projects/cognisphere/cognisphere-demo.mp4',
  true,
  1
),
(
  'proj-2',
  'flavorcraft',
  'FlavorCraft - Multi-Vendor Customized Culinary Marketplace',
  'fullstack',
  'Full-stack custom food delivery and kitchen marketplace platform enabling personalized meal customization, vendor onboarding, deal creation, and live sales analytics.',
  'FlavorCraft is an advanced multi-vendor culinary marketplace built with Node.js, Express, MongoDB, and React/Next.js. It connects home chefs and professional kitchens with food lovers. Features dietary preference filters (Diabetic Friendly, Low Oil, High Protein, Keto), a multi-step vendor application & admin approval system, interactive menu customization (ingredients & add-ons), bundled deals creation, and real-time vendor revenue analytics.',
  '/projects/flavorcraft/hero.jpg',
  '["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Redux Toolkit", "Recharts", "REST API"]'::jsonb,
  '["Personalized food discovery feed with health-driven dietary filters (Diabetic Friendly, Low Oil, Keto, High Protein)", "Multi-step Vendor Application System with CNIC verification, kitchen scale evaluation, and Admin review panel", "Interactive Dish Customization engine allowing customers to select, remove, or pay extra for ingredients", "Comprehensive Vendor Dashboard for managing live menus, creating bundled promotional deals, and tracking dish views", "Real-time Sales Overview Analytics with interactive revenue charts, order status distribution, and recent activity logs"]'::jsonb,
  'https://flavorcraft-production.up.railway.app',
  'https://github.com/hafsa-saeed/FlavorCraft-V1.git',
  'https://youtu.be/LORv60RvfCw?si=unvylMIxrhnntlDL',
  true,
  2
),
(
  'proj-3',
  'bookstore',
  'My BookStore - Full-Stack E-Commerce Platform',
  'fullstack',
  'A full-stack book e-commerce application featuring JWT user authentication, shopping cart management, order tracking, and an admin dashboard for order status updates.',
  'My BookStore is a complete MERN stack e-commerce web application. It allows users to browse books, view detailed descriptions, manage shopping carts, add items to favorites, and place orders. It also features a comprehensive Admin Dashboard to manage all customer orders, update order fulfillment statuses (Placed, Out for Delivery, Delivered, Canceled), and manage inventory.',
  '/projects/bookstore/hero.jpg',
  '["React", "Node.js", "Express", "MongoDB", "Redux Toolkit", "Tailwind CSS", "JWT Auth"]'::jsonb,
  '["User authentication system with secure JWT-based login, signup, and role management", "Interactive product catalog with category search, book details view, and price formatting", "Full-featured Shopping Cart with total price calculations and instant checkout placement", "Personalized User Profile with real-time Order History tracking and Favourites list", "Admin Management Portal to monitor all customer orders and update live delivery statuses"]'::jsonb,
  'https://youtu.be/NDjynUcd2Zc?si=lNTBP3C3C3Mdf1mO',
  'https://github.com/hafsa-saeed/book-store',
  'https://collection.cloudinary.com/zjdh3j9i/acbe4975af2f57343e582d5ec1fdbf03',
  true,
  3
),
(
  'proj-4',
  'hafsamath',
  'HafsaMath - Advanced AI Math Solver & Calculator Hub',
  'ai',
  'Full-stack AI-powered mathematical computing suite featuring 2D function graphing, formula repository, interactive calculators, and step-by-step problem analyzer.',
  'A high-powered MERN stack mathematical intelligence platform designed for students, researchers, and engineers. Covers Algebra, Trigonometry, Calculus, and Statistics. Features an AI Question Analyzer that processes natural language questions, extracts variables, suggests verified formulas, and generates step-by-step solutions, alongside a 2D Cartesian plane graphing engine and interactive practice quizzes.',
  '/projects/hafsamath/hero.jpg',
  '["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "AI Engine", "Chart.js / Canvas"]'::jsonb,
  '["AI Natural Language Problem Solver with instant formula extraction and step-by-step derivations", "Interactive 2D Cartesian Graphing Calculator supporting multi-function plotting and pan/zoom controls", "Comprehensive Formulas Directory categorized across Algebra, Geometry, Calculus, and Trigonometry", "Dynamic Calculators Hub with user calculation history, bookmarks, and formula parameters", "Interactive Practice Quiz Mode with daily streak tracking, XP points, and user performance analytics"]'::jsonb,
  '#demo',
  'https://github.com/hafsa-saeed/HafsaMath',
  '/projects/hafsamath/hafsamath-demo.mp4',
  true,
  4
),
(
  'proj-5',
  'medisim3d',
  'MediSim3D - Precision 3D Surgical Simulation & AI Guidance',
  'fullstack',
  'Decentralized 3D medical simulation and surgical practice platform featuring full-body 3D anatomical rendering, instrument arsenal, and proactive AI tutor guidance.',
  'MediSim3D bridges the gap between classroom theory and operating theatre practice. Built with Next.js, Node.js, Three.js/3D Canvas, and MongoDB. It allows medical students to perform interactive surgical procedures (e.g., Cataract Phacoemulsification) on dynamic 3D organ layers, choose tools from a surgical instrument arsenal, and receive real-time corrective feedback from an integrated AI Tutor.',
  '/projects/medisim3d/hero.jpg',
  '["Next.js", "React", "Node.js", "Express", "MongoDB", "Three.js / 3D Canvas", "AI Engine", "Tailwind CSS"]'::jsonb,
  '["Interactive 3D simulation canvas supporting organ layer rotation, zoom, and dynamic surgical instrument handling", "Integrated AI Tutor providing real-time procedure hints, mistake detection, and step-by-step guidance", "Comprehensive Surgical Tools Directory and Operative Procedures Flow documentation", "Role-based contact routing (Student, Specialist, Institution) with under 4-hour SLA response tracking", "Automated Specialist OCR credential verification system"]'::jsonb,
  '#demo',
  'https://github.com/hafsa-saeed/medisim3d',
  'https://youtu.be/KwnxHtntjFo?si=PRNpEwHbZEtcdMSE',
  false,
  5
),
(
  'proj-6',
  'sidcup-golf',
  'Sidcup Family Golf - Animated Interactive Site',
  'frontend',
  'A visually captivating, highly interactive web application built with GSAP and ScrollTrigger, featuring custom cursors and smooth scroll animations.',
  'An interactive landing page clone inspired by Sidcup Family Golf. Built to master modern frontend animation workflows, incorporating custom cursor blur dynamics, GSAP ScrollTrigger timeline animations, scrolling marquee typography, and responsive hover interactive cards.',
  '/projects/sidcup-golf/hero.jpg',
  '["HTML5", "CSS3", "JavaScript", "GSAP", "ScrollTrigger", "Vercel"]'::jsonb,
  '["Custom cursor follower with dynamic blur and glow effects on mouse movement", "ScrollTrigger-driven background transitions and element scroll reveals", "Infinite scrolling text marquees and interactive tilt card hover effects", "Fully responsive web design with immersive dark theme UI aesthetics"]'::jsonb,
  'https://sidcup-family-golf-tan.vercel.app',
  'https://github.com/hafsa-saeed/sidcup-family-golf',
  'https://youtu.be/Dz_Yq1FMTHk?si=l8wrql6JSsNeomh1',
  false,
  6
),
(
  'proj-7',
  'hafsa-web',
  'Hafsa Web - Responsive Bootstrap Layout',
  'frontend',
  'Pixel-perfect responsive web application constructed using Bootstrap 5 grid systems, custom utility classes, and interactive UI components.',
  'A fully responsive single-page agency layout built with HTML5, CSS3, and Bootstrap 5. Highlights mobile-first responsiveness, custom service cards, team showcases, and interactive accordions tested across desktop, tablet, and mobile breakpoints.',
  '/projects/hafsa-web/hero.jpg',
  '["HTML5", "CSS3", "Bootstrap 5", "Responsive Design", "Vercel"]'::jsonb,
  '["Mobile-first responsive layout engineered with Bootstrap 5 grid system", "Cross-device optimized UI tested across Desktop, Tablet, and Mobile screens", "Interactive hero carousel slider with seamless image transitions", "Custom service offering cards and collapse accordion components"]'::jsonb,
  'https://bootstrap-2nd-major-project-v5c9.vercel.app',
  'https://github.com/hafsa-saeed/bootstrap-2nd-major-project',
  'https://youtu.be/uK6YUypWx3g?si=6IZyHn0jWJ4foulu',
  false,
  7
),
(
  'proj-8',
  'netflix-clone',
  'Netflix Clone - Streaming Service UI',
  'frontend',
  'Pixel-perfect frontend replica of the Netflix landing page featuring movie showcase banners, responsive layout, and FAQ accordions.',
  'A responsive, pixel-accurate frontend clone built to master modern CSS layout techniques, dynamic landing sections, hero banner overlays, and interactive UI components like accordions using clean HTML, CSS, and JavaScript.',
  '/projects/netflix/hero.jpg',
  '["HTML5", "CSS3", "JavaScript", "Frontend", "Vercel"]'::jsonb,
  '["Pixel-perfect Netflix landing page theme with hero backdrop overlays", "Interactive FAQ accordion section built with pure JavaScript", "Multi-device showcase layout for TV, mobile, and desktop views", "Hosted live on Vercel infrastructure for fast delivery"]'::jsonb,
  'https://netflix-clone-magg.vercel.app',
  'https://github.com/hafsa-saeed/Netflix-Clone',
  'https://youtu.be/KwnxHtntjFo?si=PRNpEwHbZEtcdMSE',
  false,
  8
)
ON CONFLICT (id) DO NOTHING;

-- Seed Documents
INSERT INTO public.documents (id, title, description, category, file_url, is_active_cv)
VALUES
('doc-cv', 'Hafsa Saeed Official Curriculum Vitae', 'BS Computer Science & Full Stack Web Developer Resume', 'cv', '/Hafsa_Saeed_CV.pdf', true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. PERMISSIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'projects', 'project_media', 'credentials', 'education', 
    'experience', 'skill_categories', 'skills', 'personal_profile', 
    'documents', 'contact_messages'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Public select policy" ON public.%I;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Full access policy" ON public.%I;', t);
      EXECUTE format('CREATE POLICY "Public select policy" ON public.%I FOR SELECT USING (true);', t);
      EXECUTE format('CREATE POLICY "Full access policy" ON public.%I FOR ALL USING (true) WITH CHECK (true);', t);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipping table % (not found or error)', t;
    END;
  END LOOP;
END $$;

