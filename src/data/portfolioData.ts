import {
  Project,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  CircularSkill,
  HobbyItem,
  CredentialItem,
} from "../types.ts";

export const personalInfo = {
  name: "Hafsa Saeed",
  titles: [
    "BS Computer Science Student",
    "Full Stack Web Developer",
    "AI-Powered Dev Specialist",
    "Tech Enthusiast & Learner",
  ],
  bio: "Motivated Computer Science Student maintaining a 3.71 CGPA. Passionate about Web development, adapting to emerging modern technologies, and leveraging AI tools to accelerate software development.",
  quote: "The expert in anything was once a beginner.",
  quoteAuthor: "Helen Hayes",
  email: "hafsasaeed192@gmail.com",
  phone1: "0327-5535987",
  phone2: "0319-8114339",
  location: "Homelife Hostel, PAF Road, Mianwali, Punjab, Pakistan",
  age: "21 Years Old",
  gender: "Female",
  religion: "Islam",
  nationality: "Pakistani",
  maritalStatus: "Single",

  profileImage: "/my-photo.jpg",
  resumeUrl: "/Hafsa_Saeed_CV.pdf",
  languages: [
    { name: "Urdu", level: "Native Speaker" },
    { name: "English", level: "Proficient Professional" },
  ],
  socials: {
    github: "https://github.com/hafsa-saeed",
    linkedin:
      "https://www.linkedin.com/in/hafsa-saeed-90b53b2a6?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    twitter: "https://twitter.com/#",
    email: "mailto:hafsasaeed192@gmail.com",
    whatsapp: "https://wa.me/923461617836",
  },
  stats: [
    {
      label: "Semester Active",
      value: "6th",
      suffix: " Sem",
      desc: "BS Computer Science",
    },
    {
      label: "Tech Stack & Tools",
      value: "15",
      suffix: "+",
      desc: "Languages & Frameworks",
    },
    {
      label: "Academic Grade",
      value: "A+",
      suffix: " Grade",
      desc: "Top Matric & Pre-Med",
    },
    {
      label: "Certificates & Courses",
      value: "4",
      suffix: "+",
      desc: "DigiSkills & Automation",
    },
  ],
  goals: [
    "Continuously advance skills in full stack programming, modern web frameworks, and AI workflows.",
    "Solve impactful real-world challenges through clean code, data analytics, and responsive design.",
    "Collaborate with open-source creators and contribute to progressive tech communities.",
    "Excel in academic BS CS coursework while engineering practical commercial software.",
  ],
};

export const educationList: EducationItem[] = [
  {
    id: "bs-cs",
    degree: "BS Computer Science",
    institute: "Superior Group of Colleges, Mianwali",
    year: "Sep 2023 – 2027",
    grade: "Maintaining 3.71 CGPA",
    status: "In Progress (2 Semesters Remaining)",
    highlights: [
      "Currently pursuing 6th Semester with strong focus on software engineering.",
      "Core courses: Data Structures & Algorithms, Database Systems, Web Development, Object-Oriented Programming (C/C++).",
      "Expected degree completion: End of 2027 with honors.",
    ],
  },
  {
    id: "fsc",
    degree: "FSC Pre-Medical",
    institute: "Superior Group of Colleges, Mianwali",
    year: "Completed in 2023",
    grade: "848 / 1100 (Grade A)",
    status: "Completed with Distinction",
    highlights: [
      "Graduated with High Grade A (848/1100 marks).",
      "Developed analytical problem-solving skills, discipline, and scientific inquiry before transitioning to computing.",
    ],
  },
  {
    id: "matric",
    degree: "Matriculation (Science)",
    institute: "Govt. Girls Higher Secondary School Kundian",
    year: "Completed in 2021",
    grade: "1074 / 1100 (Grade A+)",
    status: "Top Academic Honors",
    highlights: [
      "Exceptional academic score of 1074 out of 1100 marks (Grade A+).",
      "Demonstrated academic excellence in mathematics, physics, and science disciplines.",
    ],
  },
];

export const experienceList: ExperienceItem[] = [
  {
    id: "sts-networking",
    company: "STS (Success Training System)",
    role: "Networking Specialist & Intern",
    duration: "June 2023 – December 2023",
    type: "6 Months Practical Experience",
    description:
      "Worked as a networker for 6 months, gaining extensive hands-on experience in managing enterprise network setups, hardware diagnostics, and team collaboration.",
    keyResponsibilities: [
      "Configured and maintained local area networks (LAN), routers, switches, and client workstations.",
      "Diagnosed and resolved network connectivity glitches, IP conflicts, and hardware bottlenecks.",
      "Collaborated cross-functionally with senior IT specialists on system updates and performance monitoring.",
      "Cultivated rigorous time management, technical communication, and procedural troubleshooting.",
    ],
    technologies: [
      "Network Configuration",
      "Troubleshooting",
      "LAN / Routing",
      "Hardware Diagnostics",
      "Time Management",
    ],
    iconName: "Network",
  },
  {
    id: "dream-house-teaching",
    company: "Dream House School System",
    role: "Computer Science & General Instructor",
    duration: "July 2024 – December 2024",
    type: "Educational Mentorship",
    description:
      "Delivered interactive lessons, inspiring students to appreciate computer fundamentals, digital literacy, and disciplined study habits.",
    keyResponsibilities: [
      "Delivered engaging educational curricula focused on basic computing, logical reasoning, and teamwork.",
      "Fostered an inclusive, high-encouragement classroom atmosphere supporting diverse student learning speeds.",
      "Designed visual presentations and practical assessments using modern office automation software.",
      "Refined public speaking, mentorship, patience, and empathetic communication.",
    ],
    technologies: [
      "Instructional Delivery",
      "Digital Literacy",
      "MS Office Presentation",
      "Classroom Leadership",
    ],
    iconName: "BookOpen",
  },
];

export const circularSkills: CircularSkill[] = [
  {
    name: "Frontend Development",
    percentage: 92,
    category: "React & Modern Web",
    color: "#10b981",
  },
  {
    name: "Backend & Databases",
    percentage: 84,
    category: "Node.js, Express & Mongo",
    color: "#059669",
  },
  {
    name: "Data Structures & C++",
    percentage: 86,
    category: "Core Algorithms",
    color: "#14b8a6",
  },
  {
    name: "Python & Analytics",
    percentage: 80,
    category: "Pandas & Data Insights",
    color: "#fbbf24",
  },
  {
  name: "Databases",
  percentage: 82,
  category: "MongoDB, Supabase & MySQL",
  color: "#0ea5e9",
},
{
  name: "Programming & OOP",
  percentage: 84,
  category: "C, C++, OOP & JavaScript",
  color: "#8b5cf6",
},
{
  name: "WordPress & CMS",
  percentage: 85,
  category: "Websites & Content Management",
  color: "#2563eb",
},
{
  name: "Git & GitHub",
  percentage: 88,
  category: "Version Control & Collaboration",
  color: "#f97316",
},
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Frontend Development",
    skills: [
      {
        name: "HTML5 & Semantic Web",
        level: 95,
        description: "Accessible, SEO-structured web markup",
      },
      {
        name: "CSS3 & Modern Layouts",
        level: 92,
        description: "Flexbox, CSS Grid, custom keyframes & media queries",
      },
      {
        name: "JavaScript (ES6+)",
        level: 88,
        description: "DOM manipulation, asynchronous fetch, modern patterns",
      },
      {
        name: "React.js",
        level: 85,
        description:
          "Hooks, component lifecycles, state management, modular design",
      },
      {
        name: "Tailwind CSS",
        level: 90,
        description:
          "Utility-first modern styling, dark mode, responsive tokens",
      },
      {
        name: "Bootstrap 5",
        level: 88,
        description: "Component system, responsive grid layouts, rapid UI",
      },
    ],
  },
  {
    category: "Backend & Databases",
    skills: [
      {
        name: "Node.js",
        level: 82,
        description: "Server runtime, package management, async handlers",
      },
      {
        name: "Express.js",
        level: 84,
        description: "RESTful API routing, middleware, JSON controllers",
      },
      {
        name: "MongoDB",
        level: 80,
        description: "Document schemas, NoSQL CRUD operations, aggregation",
      },
      {
        name: "MySQL",
        level: 78,
        description: "Relational database tables, SQL queries, normalized keys",
      },
    ],
  },
  {
    category: "Programming & Data",
    skills: [
      {
        name: "Python",
        level: 85,
        description: "Scripting, logic, object orientation, automation",
      },
      {
        name: "Pandas (Python)",
        level: 78,
        description: "Dataframes, cleaning, exploratory statistics, filtering",
      },
      {
        name: "C & C++",
        level: 84,
        description: "Memory management, pointers, OOP paradigms, core syntax",
      },
      {
        name: "Data Structures & Algorithms",
        level: 82,
        description: "Arrays, stacks, queues, trees, searching & sorting",
      },
    ],
  },
  {
    category: "AI Tools & Modern Workflow",
    skills: [
      {
        name: "AI Web Dev Workflows",
        level: 92,
        description: "Prompt engineering, component prototyping with AI",
      },
      {
        name: "AI Dev Tools (Lovable, Cursor, Claude)",
        level: 90,
        description: "Accelerated IDE coding, intelligent refactoring",
      },
      {
        name: "Gemini & ChatGPT",
        level: 94,
        description: "Problem analysis, algorithm design, documentation",
      },
      {
        name: "WordPress (DigiSkills)",
        level: 85,
        description: "Theme customization, plugins, CMS administration",
      },
      {
        name: "MS Office Automation",
        level: 95,
        description: "Advanced Word, analytical Excel sheets, PowerPoint decks",
      },
    ],
  },
  {
    category: "Professional & Soft Skills",
    skills: [
      {
        name: "Analytical Problem Solving",
        level: 92,
        description:
          "Breaking down complex computing challenges systematically",
      },
      {
        name: "Communication & Teaching",
        level: 90,
        description:
          "Explaining technical concepts clearly to peers & learners",
      },
      {
        name: "Technical Troubleshooting",
        level: 88,
        description: "Hardware, software, and networking fault isolation",
      },
      {
        name: "Time Management & Discipline",
        level: 92,
        description: "Balancing degree semesters, projects, and learning",
      },
      {
        name: "Adaptability & Quick Learning",
        level: 95,
        description: "Rapidly mastering new AI models, libraries, and tools",
      },
    ],
  },
];

export const hobbiesList: HobbyItem[] = [
  {
    id: "tech-exploration",
    title: "Exploring New Software & Tech",
    description:
      "Constantly testing emergent AI platforms, web development tools, and cutting-edge software utilities.",
    icon: "Cpu",
    colorClass: "from-emerald-500 to-teal-600",
    tag: "Continuous Learning",
  },
  {
    id: "programming-coding",
    title: "Learning Programming & Coding",
    description:
      "Tackling programming puzzles, building side projects in React and Python, and mastering modern algorithms.",
    icon: "Code2",
    colorClass: "from-emerald-600 to-green-700",
    tag: "Core Passion",
  },
  {
    id: "reading",
    title: "Reading & Knowledge Seeking",
    description:
      "Immersing in computer science texts, technology articles, and inspiring personal development literature.",
    icon: "BookMarked",
    colorClass: "from-teal-600 to-emerald-700",
    tag: "Mind Growth",
  },
  {
    id: "traveling",
    title: "Traveling & Exploration",
    description:
      "Discovering new landscapes across Pakistan, gaining fresh perspectives, and recharging creativity.",
    icon: "Compass",
    colorClass: "from-emerald-500 to-amber-500",
    tag: "Adventure",
  },
];

export const projectsList: Project[] = [
  {
    id: "proj-1",
    title: "CogniSphere - Enterprise Multi-Tenant SaaS L&D Platform",
    category: "fullstack",
    description:
      "Architected an enterprise multi-tenant learning management platform with strict data isolation, role-based access control (Super Admin, HR Admin, Learner), AI-driven quiz generation, and real-time MRR analytics.",
    longDescription:
      "CogniSphere is a multi-tenant Learning & Development SaaS solution engineered to provide fully isolated branded portals for organizations. Features a Super Admin billing & MRR engine, an HR Admin panel equipped with an AI Quiz Architect and dynamic Certificate Generator, and an intuitive Learner portal for seamless course execution.",
    image: "/projects/cognisphere/hero.jpg",
    tags: [
      "Next.js",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "Multi-Tenancy",
      "OpenAI / AI Engine",
      "Recharts",
    ],
    features: [
      "Strict multi-tenant architecture with custom subdomains and isolated database schemas per organization",
      "Super Admin dashboard tracking Monthly Recurring Revenue (MRR), tier quotas, system broadcasts, and audit logs",
      "AI Quiz Architect generating automated assessments directly from course content and custom prompts",
      "Automated Certificate Engine featuring dynamic token interpolation ({learner_name}, {course_name}) and digital signature verification",
      "Role-based portal access with dedicated course creation, drag-and-drop modules, and learner progress analytics",
    ],
    videoUrl: "/projects/cognisphere/cognisphere-demo.mp4",
    screenshots: [
      "/projects/cognisphere/hero.jpg",
      "/projects/cognisphere/screenshot-1.jpg",
      "/projects/cognisphere/screenshot-2.jpg",
      "/projects/cognisphere/screenshot-3.jpg",
      "/projects/cognisphere/screenshot-4.jpg",
      "/projects/cognisphere/screenshot-5.jpg",
      "/projects/cognisphere/screenshot-6.jpg",
      "/projects/cognisphere/screenshot-7.jpg",
      "/projects/cognisphere/screenshot-8.jpg",
      "/projects/cognisphere/screenshot-9.jpg",
    ],
    liveUrl: "#demo",
    githubUrl:
      "https://github.com/hafsa-saeed/CongniSphere-Tanent-Project-.git", // Actual GitHub repository link
  },
  {
    id: "proj-2",
    title: "FlavorCraft - Multi-Vendor Customized Culinary Marketplace",
    category: "fullstack",
    description:
      "Full-stack custom food delivery and kitchen marketplace platform enabling personalized meal customization, vendor onboarding, deal creation, and live sales analytics.",
    longDescription:
      "FlavorCraft is an advanced multi-vendor culinary marketplace built with Node.js, Express, MongoDB, and React/Next.js. It connects home chefs and professional kitchens with food lovers. Features dietary preference filters (Diabetic Friendly, Low Oil, High Protein, Keto), a multi-step vendor application & admin approval system, interactive menu customization (ingredients & add-ons), bundled deals creation, and real-time vendor revenue analytics.",
    image: "/projects/flavorcraft/hero.jpg",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "Redux Toolkit",
      "Recharts",
      "REST API",
    ],
    features: [
      "Personalized food discovery feed with health-driven dietary filters (Diabetic Friendly, Low Oil, Keto, High Protein)",
      "Multi-step Vendor Application System with CNIC verification, kitchen scale evaluation, and Admin review panel",
      "Interactive Dish Customization engine allowing customers to select, remove, or pay extra for ingredients",
      "Comprehensive Vendor Dashboard for managing live menus, creating bundled promotional deals, and tracking dish views",
      "Real-time Sales Overview Analytics with interactive revenue charts, order status distribution, and recent activity logs",
    ],
    videoUrl: "https://youtu.be/LORv60RvfCw?si=unvylMIxrhnntlDL",
    screenshots: [
      "/projects/flavorcraft/hero.jpg",
      "/projects/flavorcraft/screenshot-1.jpg",
      "/projects/flavorcraft/screenshot-2.jpg",
      "/projects/flavorcraft/screenshot-3.jpg",
      "/projects/flavorcraft/screenshot-4.jpg",
      "/projects/flavorcraft/screenshot-5.jpg",
      "/projects/flavorcraft/screenshot-6.jpg",
      "/projects/flavorcraft/screenshot-7.jpg",
      "/projects/flavorcraft/screenshot-8.jpg",
      "/projects/flavorcraft/screenshot-9.jpg",
    ],
    liveUrl: "https://flavorcraft-production.up.railway.app",
    githubUrl: "https://github.com/hafsa-saeed/FlavorCraft-V1.git",
  },
  {
    id: "proj-3",
    title: "My BookStore - Full-Stack E-Commerce Platform",
    category: "fullstack",
    description:
      "A full-stack book e-commerce application featuring JWT user authentication, shopping cart management, order tracking, and an admin dashboard for order status updates.",
    longDescription:
      "My BookStore is a complete MERN stack e-commerce web application. It allows users to browse books, view detailed descriptions, manage shopping carts, add items to favorites, and place orders. It also features a comprehensive Admin Dashboard to manage all customer orders, update order fulfillment statuses (Placed, Out for Delivery, Delivered, Canceled), and manage inventory.",
    image: "/projects/bookstore/hero.jpg",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Redux Toolkit",
      "Tailwind CSS",
      "JWT Auth",
    ],
    features: [
      "User authentication system with secure JWT-based login, signup, and role management",
      "Interactive product catalog with category search, book details view, and price formatting",
      "Full-featured Shopping Cart with total price calculations and instant checkout placement",
      "Personalized User Profile with real-time Order History tracking and Favourites list",
      "Admin Management Portal to monitor all customer orders and update live delivery statuses",
    ],
    videoUrl:
      "https://collection.cloudinary.com/zjdh3j9i/acbe4975af2f57343e582d5ec1fdbf03",
    screenshots: [
      "/projects/bookstore/hero.jpg",
      "/projects/bookstore/screenshot-1.jpg",
      "/projects/bookstore/screenshot-2.jpg",
      "/projects/bookstore/screenshot-3.jpg",
      "/projects/bookstore/screenshot-4.jpg",
      "/projects/bookstore/screenshot-5.jpg",
    ],
    liveUrl: "https://youtu.be/NDjynUcd2Zc?si=lNTBP3C3C3Mdf1mO",
    githubUrl: "https://github.com/hafsa-saeed/book-store",
  },
  {
    id: "proj-4",
    title: "HafsaMath - Advanced AI Math Solver & Calculator Hub",
    category: "ai",
    description:
      "Full-stack AI-powered mathematical computing suite featuring 2D function graphing, formula repository, interactive calculators, and step-by-step problem analyzer.",
    longDescription:
      "A high-powered MERN stack mathematical intelligence platform designed for students, researchers, and engineers. Covers Algebra, Trigonometry, Calculus, and Statistics. Features an AI Question Analyzer that processes natural language questions, extracts variables, suggests verified formulas, and generates step-by-step solutions, alongside a 2D Cartesian plane graphing engine and interactive practice quizzes.",
    image: "/projects/hafsamath/hero.jpg",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "AI Engine",
      "Chart.js / Canvas",
    ],
    features: [
      "AI Natural Language Problem Solver with instant formula extraction and step-by-step derivations",
      "Interactive 2D Cartesian Graphing Calculator supporting multi-function plotting and pan/zoom controls",
      "Comprehensive Formulas Directory categorized across Algebra, Geometry, Calculus, and Trigonometry",
      "Dynamic Calculators Hub with user calculation history, bookmarks, and formula parameters",
      "Interactive Practice Quiz Mode with daily streak tracking, XP points, and user performance analytics",
    ],
    videoUrl: "/projects/hafsamath/hafsamath-demo.mp4",
    screenshots: [
      "/projects/hafsamath/hero.jpg",
      "/projects/hafsamath/screenshot-1.jpg",
      "/projects/hafsamath/screenshot-2.jpg",
      "/projects/hafsamath/screenshot-3.jpg",
      "/projects/hafsamath/screenshot-4.jpg",
      "/projects/hafsamath/screenshot-5.jpg",
      "/projects/hafsamath/screenshot-6.jpg",
      "/projects/hafsamath/screenshot-7.jpg",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/HafsaMath",
  },
  {
    id: "proj-5",
    title: "MediSim3D - Precision 3D Surgical Simulation & AI Guidance",
    category: "fullstack",
    description:
      "Decentralized 3D medical simulation and surgical practice platform featuring full-body 3D anatomical rendering, instrument arsenal, and proactive AI tutor guidance.",
    longDescription:
      "MediSim3D bridges the gap between classroom theory and operating theatre practice. Built with Next.js, Node.js, Three.js/3D Canvas, and MongoDB. It allows medical students to perform interactive surgical procedures (e.g., Cataract Phacoemulsification) on dynamic 3D organ layers, choose tools from a surgical instrument arsenal, and receive real-time corrective feedback from an integrated AI Tutor.",
    image: "/projects/medisim3d/hero.jpg",
    tags: [
      "Next.js",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Three.js / 3D Canvas",
      "AI Engine",
      "Tailwind CSS",
    ],
    features: [
      "Interactive 3D simulation canvas supporting organ layer rotation, zoom, and dynamic surgical instrument handling",
      "Integrated AI Tutor providing real-time procedure hints, mistake detection, and step-by-step guidance",
      "Comprehensive Surgical Tools Directory and Operative Procedures Flow documentation",
      "Role-based contact routing (Student, Specialist, Institution) with under 4-hour SLA response tracking",
      "Automated Specialist OCR credential verification system",
    ],
    videoUrl: "https://youtu.be/KwnxHtntjFo?si=PRNpEwHbZEtcdMSE",
    screenshots: [
      "/projects/medisim3d/hero.jpg",
      "/projects/medisim3d/screenshot-1.jpg",
      "/projects/medisim3d/screenshot-2.jpg",
      "/projects/medisim3d/screenshot-3.jpg",
      "/projects/medisim3d/screenshot-4.jpg",
      "/projects/medisim3d/screenshot-5.jpg",
      "/projects/medisim3d/screenshot-6.jpg",
      "/projects/medisim3d/screenshot-7.jpg",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/medisim3d",
  },
  {
    id: "proj-6",
    title: "Sidcup Family Golf - Animated Interactive Site",
    category: "frontend",
    description:
      "A visually captivating, highly interactive web application built with GSAP and ScrollTrigger, featuring custom cursors and smooth scroll animations.",
    longDescription:
      "An interactive landing page clone inspired by Sidcup Family Golf. Built to master modern frontend animation workflows, incorporating custom cursor blur dynamics, GSAP ScrollTrigger timeline animations, scrolling marquee typography, and responsive hover interactive cards.",
    image: "/projects/sidcup-golf/hero.jpg",
    tags: ["HTML5", "CSS3", "JavaScript", "GSAP", "ScrollTrigger", "Vercel"],
    features: [
      "Custom cursor follower with dynamic blur and glow effects on mouse movement",
      "ScrollTrigger-driven background transitions and element scroll reveals",
      "Infinite scrolling text marquees and interactive tilt card hover effects",
      "Fully responsive web design with immersive dark theme UI aesthetics",
    ],
    videoUrl: "https://youtu.be/Dz_Yq1FMTHk?si=l8wrql6JSsNeomh1",
    screenshots: [
      "/projects/sidcup-golf/hero.jpg",
      "/projects/sidcup-golf/screenshot-1.jpg",
      "/projects/sidcup-golf/screenshot-2.jpg",
      "/projects/sidcup-golf/screenshot-3.jpg",
      "/projects/sidcup-golf/screenshot-4.jpg",
    ],
    liveUrl: "https://sidcup-family-golf-tan.vercel.app",
    githubUrl: "https://github.com/hafsa-saeed/sidcup-family-golf",
  },
  {
    id: "proj-7",
    title: "Hafsa Web - Responsive Bootstrap Layout",
    category: "frontend",
    description:
      "Pixel-perfect responsive web application constructed using Bootstrap 5 grid systems, custom utility classes, and interactive UI components.",
    longDescription:
      "A fully responsive single-page agency layout built with HTML5, CSS3, and Bootstrap 5. Highlights mobile-first responsiveness, custom service cards, team showcases, and interactive accordions tested across desktop, tablet, and mobile breakpoints.",
    image: "/projects/hafsa-web/hero.jpg",
    tags: ["HTML5", "CSS3", "Bootstrap 5", "Responsive Design", "Vercel"],
    features: [
      "Mobile-first responsive layout engineered with Bootstrap 5 grid system",
      "Cross-device optimized UI tested across Desktop, Tablet, and Mobile screens",
      "Interactive hero carousel slider with seamless image transitions",
      "Custom service offering cards and collapse accordion components",
    ],
    videoUrl: "https://youtu.be/uK6YUypWx3g?si=6IZyHn0jWJ4foulu",
    screenshots: [
      "/projects/hafsa-web/hero.jpg",
      "/projects/hafsa-web/screenshot-1.jpg",
      "/projects/hafsa-web/screenshot-2.jpg",
      "/projects/hafsa-web/screenshot-3.jpg",
      "/projects/hafsa-web/screenshot-4.jpg",
      "/projects/hafsa-web/screenshot-5.jpg",
    ],
    liveUrl: "https://bootstrap-2nd-major-project-v5c9.vercel.app",
    githubUrl: "https://github.com/hafsa-saeed/bootstrap-2nd-major-project",
  },
  {
    id: "proj-8",
    title: "Netflix Clone - Streaming Service UI",
    category: "frontend",
    description:
      "Pixel-perfect frontend replica of the Netflix landing page featuring movie showcase banners, responsive layout, and FAQ accordions.",
    longDescription:
      "A responsive, pixel-accurate frontend clone built to master modern CSS layout techniques, dynamic landing sections, hero banner overlays, and interactive UI components like accordions using clean HTML, CSS, and JavaScript.",
    image: "/projects/netflix/hero.jpg",
    tags: ["HTML5", "CSS3", "JavaScript", "Frontend", "Vercel"],
    features: [
      "Pixel-perfect Netflix landing page theme with hero backdrop overlays",
      "Interactive FAQ accordion section built with pure JavaScript",
      "Multi-device showcase layout for TV, mobile, and desktop views",
      "Hosted live on Vercel infrastructure for fast delivery",
    ],
    videoUrl: "https://youtu.be/KwnxHtntjFo?si=PRNpEwHbZEtcdMSE",
    screenshots: [
      "/projects/netflix/hero.jpg",
      "/projects/netflix/screenshot-1.jpg",
      "/projects/netflix/screenshot-2.jpg",
      "/projects/netflix/screenshot-3.jpg",
    ],
    liveUrl: "https://netflix-clone-magg.vercel.app",
    githubUrl: "https://github.com/hafsa-saeed/Netflix-Clone",
  },
];
export const credentialsList: CredentialItem[] = [
  {
    id: "cred-wp",
    title: "WordPress Development Certification",
    issuer: "DigiSkills Training Program (Govt of Pakistan)",
    date: "Certified 2023",
    credentialId: "DS-WP-89241",
    skillsLearned: [
      "WordPress CMS",
      "Custom Theme Styling",
      "Plugin Configuration",
      "WooCommerce Setup",
      "SEO Basics",
    ],
    category: "Web Development",
    imageThumbnail: "/credentials/wordpress-certificate.jpg",
  },
  {
    id: "cred-da",
    title: "Data Analytics & Business Development",
    issuer: "DigiSkills Training Program",
    date: "Certified 2023",
    credentialId: "DS-DABD-44109",
    skillsLearned: [
      "Business Metrics",
      "Data Exploration",
      "Excel Power Query",
      "Statistical Visuals",
      "Strategic Planning",
    ],
    category: "Data Science & Analytics",
    imageThumbnail: "/credentials/data-analytics-certificate.jpg",
  },

  {
    id: "cred-office",
    title: "Office Automation & Productivity Suite",
    issuer: "Computer Science Institute Mianwali",
    date: "Completed 2022",
    credentialId: "OA-MIA-7712",
    skillsLearned: [
      "MS Word Advanced Formatting",
      "Excel Formulas & Pivot Tables",
      "PowerPoint Storytelling",
      "Speed Typing",
    ],
    category: "Office Automation",
    imageThumbnail: "/credentials/office-automation-certificate.jpg",
  },
  {
    id: "cred-matric",
    title: "Matriculation Academic Honors (Grade A+)",
    issuer: "Board of Intermediate & Secondary Education",
    date: "Awarded 2021",
    credentialId: "BISE-1074-DIST",
    skillsLearned: [
      "1074/1100 Marks (97.6%)",
      "Mathematics Excellence",
      "Physics & Chemistry Distinction",
    ],
    category: "Academic Distinction",
    imageThumbnail: "/credentials/matric-result-card.jpg",
  },
  {
    id: "cred-fsc",
    title: "FSC Academic Honors (Grade A)",
    issuer: "Board of Intermediate & Secondary Education",
    date: "Awarded 2023",
    credentialId: "BISE-848-DIST",
    skillsLearned: [
      "848/1100 Marks (97.6%)",
      "Mathematics Excellence",
      "Physics & Chemistry Distinction",
    ],
    category: "Academic Distinction",
    imageThumbnail: "/credentials/fsc-result-card.jpg",
  },
  {
    id: "cred-bc",
    title: "BS Computer Science Academic Honors (Maintaining 3.71 CGPA)",
    issuer:
      "Academic Institution Superior Group of Colleges, Mianwali, Ailiated from Sargodha University",
    date: "Expected degree completion: End of 2027",
    credentialId: "6th semester continue",
    skillsLearned: [
      "3.71 CGPA (Maintaining) / 4.00",
      "Computer Science ",
      "C, C++, Python, Data Structures, Web Development, Networking, Operating system, Database Management, AI Tools, and Software Engineering",
    ],
    category: "Academic Distinction",
    imageThumbnail: "/credentials/bs-cs-5th-sem-transcript.jpg",
  },
];
