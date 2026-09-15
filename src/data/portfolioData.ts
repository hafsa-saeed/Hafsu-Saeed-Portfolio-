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
    github: "https://github.com/#",
    linkedin: "https://linkedin.com/in/#",
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
    title: "EduStream - Academic Learning Portal",
    category: "web",
    description:
      "A full-featured responsive student portal designed for college assignments, lecture tracking, and semester grading.",
    longDescription:
      "Built with modern React, Tailwind CSS, and a Node.js REST API backend. It allows students to manage academic schedules, track semester progress, view uploaded syllabi, and practice past papers with instant grading.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    features: [
      "Dynamic course enrollment and grade calculator",
      "Interactive timetable with calendar views",
      "Teacher notice board with real-time updates",
      "Mobile-first responsive glassmorphic UI",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
  },
  {
    id: "proj-2",
    title: "Network Pulse - Diagnostics & Topology Tool",
    category: "data",
    description:
      "Interactive network diagnostic dashboard inspired by hands-on STS networking practice.",
    longDescription:
      "Created to visualize network node health, packet latency, routing tables, and IP allocations. Integrates interactive graphs and troubleshooting checklists developed during practical networking at STS.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    tags: ["JavaScript", "Python", "Networking", "CSS Grid", "Chart.js"],
    features: [
      "Subnet calculation and IP address allocation map",
      "Visual topology tree with active status alerts",
      "Step-by-step diagnostic wizard for connection dropouts",
      "Exportable network performance logs",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
  },
  {
    id: "proj-3",
    title: "DigiSkills Data Insights & Sales Analytics",
    category: "data",
    description:
      "Business intelligence dashboard developed using Python, Pandas data cleaning, and modern visual cards.",
    longDescription:
      "Applied DigiSkills Data Analytics principles to real-world e-commerce retail data. Cleans dirty records, detects sales trends across regions, and visualizes monthly profit margins with actionable insights.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["Python", "Pandas", "Data Analytics", "Bootstrap", "DigiSkills"],
    features: [
      "Pandas dataset transformation pipeline",
      "KPI summary cards for revenue, retention, and growth",
      "Filter by category, timeline, and regional geography",
      "Automated PDF executive summary generator",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
  },
  {
    id: "proj-4",
    title: "AI Study Buddy - Smart Prompt Assistant",
    category: "ai",
    description:
      "Interactive web assistant utilizing modern AI workflows (Gemini / Claude prompts) to generate personalized study quizzes.",
    longDescription:
      "Demonstrates advanced usage of generative AI tools in web development. Students can input any CS topic (e.g. Binary Search Trees, SQL Normalization) and get concise concept summaries and self-tests.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "AI Integration", "Tailwind CSS", "Prompt Engineering"],
    features: [
      "Instant topic flashcard generation",
      "Interactive multiple-choice knowledge quizzes",
      "Code snippet explanations for C++ & JavaScript",
      "Dark/Light high-contrast study mode",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
  },
  {
    id: "proj-5",
    title: "Luxe Flora - Green Floral E-Commerce Store",
    category: "web",
    description:
      "Modern e-commerce showcase featuring rich emerald glassmorphism, animated cart, and checkout flow.",
    longDescription:
      "A client-side e-commerce platform built with React and Tailwind CSS. Features product filtering, animated cart drawer, search autocomplete, and instant checkout invoice simulator.",
    image:
      "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Tailwind CSS", "Lucide Icons", "Local State"],
    features: [
      "Filterable catalog with price range sliders",
      "Persistent cart state with quantity controls",
      "Responsive card hover zoom effects",
      "One-click simulated checkout receipt",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
  },
  {
    id: "proj-6",
    title: "DigiSkills WordPress Custom Portal",
    category: "cms",
    description:
      "Customized WordPress portal demonstrating complete theme tailoring, plugin management, and responsive pages.",
    longDescription:
      "Engineered as part of the DigiSkills WordPress certification. Includes custom post types, responsive navigation, contact forms, and performance optimization.",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    tags: ["WordPress", "PHP", "DigiSkills", "SEO", "CMS"],
    features: [
      "Custom responsive theme styling",
      "Contact form with email dispatch",
      "SEO-friendly permalink configuration",
      "Fast-loading caching setup",
    ],
    liveUrl: "#demo",
    githubUrl: "#github",
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
