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

  profileImage: "public/my-photo.jpg",
  resumeUrl: "public/Hafsa_Saeed_CV.pdf",
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
    title: "CogniSphere - B2B Multi-Tenant Enterprise Learning SaaS",
    category: "fullstack",
    description:
      "Enterprise B2B learning platform enabling organization admins to manage isolated course instances, lectures, and quizzes.",
    longDescription:
      "A complete multi-tenant SaaS architecture built with Node.js, Express, and MongoDB. It allows super admins to provision custom enterprise links for companies, while company admins upload course lectures, PDF materials, and quiz engines for their enrolled learners.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    tags: ["Node.js", "Express.js", "MongoDB", "JavaScript", "HTML5", "CSS3"],
    features: [
      "Multi-tenant link provisioning and domain isolation",
      "Role-based dashboards for Super Admin, Company Admin, and Learners",
      "Dynamic course content uploading (Lectures, Quizzes, PDF Notes)",
      "Automated learner progress tracking and course completion certificates",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/CongniSphere",
  },
  {
    id: "proj-2",
    title: "Flavor Craft - Custom Food Marketplace & Vendor Portal",
    category: "fullstack",
    description:
      "Digital culinary marketplace connecting cloud kitchens with customers for personalized food orders.",
    longDescription:
      "A multi-vendor platform where local food vendors apply for admin verification, build custom storefronts, and accept tailored meal orders from customers. Features location-based search, profile reviews, and active order tracking.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    tags: ["Node.js", "Express.js", "MongoDB", "JavaScript", "Railway"],
    features: [
      "Admin verification & approval pipeline for cloud kitchens",
      "Custom dish customization engine for end customers",
      "Vendor profile management with dish offers and customer reviews",
      "Deployed live on Railway cloud infrastructure",
    ],
    liveUrl: "https://flavorcraft.up.railway.app",
    githubUrl: "https://github.com/hafsa-saeed/FlavorCraft-V1",
  },
  {
    id: "proj-3",
    title: "Bookish - Full-Stack Online Book Store",
    category: "fullstack",
    description:
      "Full-stack e-commerce book platform built with React, Vite, Tailwind CSS, and Node.js.",
    longDescription:
      "A fast and responsive e-commerce application designed for browsing, searching, and buying books. Includes dynamic cart management, smooth REST API interactions between the React frontend and Express backend, and optimized loading with Vite.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Node.js", "Express", "MongoDB", "Vite", "Tailwind CSS"],
    features: [
      "Seamless integration between React frontend and Express REST API",
      "Dynamic catalog search and category filtering",
      "Persistent state shopping cart with order processing",
      "Modern UI built with Vite speed and Tailwind CSS styling",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/Full-Book-Online-Store",
  },
  {
    id: "proj-4",
    title: "MediSim 3D - AI Medical & Surgical Simulator",
    category: "ai",
    description:
      "Interactive surgical practice platform featuring 3D models, operational instructions, and AI tutoring guidance.",
    longDescription:
      "A large-scale MERN stack medical simulation platform designed for medical students. It renders interactive 3D models to practice surgical procedures, offers step-by-step tool guidance, and provides real-time AI tutoring during practice tests.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "3D Graphics",
      "AI Engine",
    ],
    features: [
      "Interactive 3D model manipulation for virtual surgical training",
      "AI Tutor integration for step-by-step practice assistance",
      "Comprehensive medical tools and surgery instruction guides",
      "Practice test engine with real-time feedback and metrics",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/MediSim-3D-Project",
  },
  {
    id: "proj-5",
    title: "HafsaMath - Advanced AI Math Solver & Calculator Hub",
    category: "ai",
    description:
      "Comprehensive computational suite with scientific calculators, formula reference hub, and AI question step-solver.",
    longDescription:
      "A high-powered MERN stack mathematical platform covering Algebra, Trigonometry, Calculus, and Statistics. Integrates an AI question analyzer that identifies user inputs, suggests relevant formulas, and solves problems step-by-step while tracking user progress.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    tags: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
      "AI Engine",
    ],
    features: [
      "Scientific and Graphical Calculators for complex calculations",
      "Extensive formula library across higher-level mathematical branches",
      "AI Question Analyzer for instant formula suggestions and step-by-step solutions",
      "User dashboard to bookmark formulas, save solution history, and track progress",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/HafsaMath",
  },
  {
    id: "proj-6",
    title: "Sidcup Family Golf - Animated Interactive Site",
    category: "frontend",
    description:
      "Modern motion-centric frontend web application exploring smooth animations and dynamic interactions.",
    longDescription:
      "A dynamic, visually engaging frontend website built while mastering web animation libraries. It incorporates smooth scrolling effects, custom cursor interactions, and fluid hover triggers.",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    tags: ["JavaScript", "HTML5", "CSS3", "Web Animations", "Framer Motion"],
    features: [
      "Custom cursor interactions and fluid hover effects",
      "Smooth scroll triggers and section transitions",
      "Fully responsive multimedia layout for desktop and mobile devices",
      "Built with clean, semantic web standards",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/sidcup-family-golf",
  },
  {
    id: "proj-7",
    title: "Hafsa Web - Responsive Bootstrap Layout",
    category: "frontend",
    description:
      "A pixel-perfect responsive web application constructed to master Bootstrap 5 utilities and grid systems.",
    longDescription:
      "A sleek, lightweight single-page agency template built completely with HTML, CSS, and Bootstrap. Focuses on cross-device responsiveness, clean typography, and UI consistency with zero bloat.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    tags: ["HTML5", "CSS3", "Bootstrap 5", "Responsive Design"],
    features: [
      "100% mobile-first responsive layout across all viewports",
      "Clean utilization of Bootstrap grid system and UI components",
      "Lightweight, fast load times with smooth scrolling navigation",
      "Cross-browser tested for design consistency",
    ],
    liveUrl: "#demo",
    githubUrl: "https://github.com/hafsa-saeed/bootstrap-2nd-major-project",
  },
  {
    id: "proj-8",
    title: "Netflix Clone - Streaming Service UI",
    category: "frontend",
    description:
      "Frontend replica of the Netflix web app featuring movie banner showcases and interactive accordion UI.",
    longDescription:
      "A pixel-accurate frontend clone focusing on modern web styling, custom media rows, hero sections, and accordion FAQ panels built using vanilla JavaScript, HTML5, and CSS3.",
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80",
    tags: ["HTML5", "CSS3", "JavaScript", "Frontend"],
    features: [
      "Accurate dark-theme layout inspired by modern streaming services",
      "Interactive FAQ accordion component using Vanilla JS",
      "Custom horizontal movie poster cards and banner layouts",
      "Fluid responsive layout across various screens",
    ],
    liveUrl: "#demo",
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
    imageThumbnail: "public/credentials/wordpress-certificate.jpg",
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
    imageThumbnail: "public/credentials/data-analytics-certificate.jpg",
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
    imageThumbnail: "public/credentials/office-automation-certificate.jpg",
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
    imageThumbnail: "public/credentials/matric-result-card.jpg",
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
    imageThumbnail: "public/credentials/fsc-result-card.jpg",
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
    imageThumbnail: "public/credentials/bs-cs-5th-sem-transcript.jpg",
  },
];
