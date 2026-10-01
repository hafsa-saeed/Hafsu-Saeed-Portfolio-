import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  personalInfo as initialPersonalInfo,
  projectsList as initialProjects,
  educationList as initialEducation,
  experienceList as initialExperience,
  skillCategories as initialSkillCategories,
  circularSkills as initialCircularSkills,
  credentialsList as initialCredentials,
  hobbiesList as initialHobbies,
} from "../data/portfolioData";
import {
  Project,
  ProjectItem,
  EducationItem,
  ExperienceItem,
  SkillCategory,
  CircularSkill,
  CredentialItem,
  DocumentItem,
  ContactMessage,
  PersonalInfo,
  HobbyItem,
  ProjectMedia,
} from "../types";

const LOCAL_STORAGE_PREFIX = "hafsa_cms_";

// Local storage helper
function getLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Local storage read error:", e);
  }
  return fallback;
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

export const portfolioService = {
  // ==========================================
  // 1. PROJECTS
  // ==========================================
  async getProjects(): Promise<ProjectItem[]> {
    // 1. Try fetching live projects via server backend (direct to Supabase with service role)
    try {
      const res = await fetch("/api/portfolio/projects");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.projects) && json.projects.length > 0) {
          setLocal("projects", json.projects);
          return json.projects;
        }
      }
    } catch (e) {
      console.warn("Backend projects fetch notice, trying direct client:", e);
    }

    // 2. Direct client Supabase fallback
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((row: any) => ({
            id: row.id,
            slug: row.slug || row.id,
            title: row.title || "Untitled Project",
            category: row.category || "fullstack",
            description: row.description || "",
            longDescription: row.long_description || row.description || "",
            image: row.image || "/projects/placeholder.jpg",
            tags: Array.isArray(row.tags) ? row.tags : [],
            features: Array.isArray(row.features) ? row.features : [],
            liveUrl: row.live_url || undefined,
            githubUrl: row.github_url || undefined,
            videoUrl: row.video_url || undefined,
            screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
            featured: Boolean(row.featured),
            displayOrder: typeof row.display_order === "number" ? row.display_order : 0,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
          setLocal("projects", mapped);
          return mapped;
        }
      } catch (err) {
        console.warn("Supabase direct projects fetch error, fallback to local:", err);
      }
    }

    // 3. Local storage fallback
    const localProjects = getLocal<ProjectItem[]>("projects", initialProjects);
    const seen = new Set<string>();
    const sanitized = localProjects.map((p) => {
      let id = p.id;
      if (id === "proj-8" && p.title.toLowerCase().includes("sidcup")) {
        id = "proj-6";
      }
      if (seen.has(id)) {
        id = `${id}-${Math.random().toString(36).substring(2, 7)}`;
      }
      seen.add(id);
      return { ...p, id };
    });
    return sanitized;
  },

  async saveProject(project: ProjectItem): Promise<ProjectItem> {
    // 1. Always keep local storage updated first so UI immediately reflects changes
    const current = getLocal<ProjectItem[]>("projects", initialProjects);
    const existingIndex = current.findIndex((p) => p.id === project.id);
    let updated: ProjectItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = project;
    } else {
      updated = [...current, project];
    }
    setLocal("projects", updated);

    // 2. Save directly to Supabase via server API (handles missing columns and permissions automatically)
    try {
      const res = await fetch("/api/portfolio/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        console.log(`[Project synced to Supabase via server]: ${project.id}`);
      }
    } catch (apiErr) {
      console.warn("[Server project sync warning]:", apiErr);
    }

    // 3. Direct client SDK sync as well if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const payload: Record<string, any> = {
          id: project.id,
          slug: project.slug || project.id.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          title: project.title,
          category: project.category,
          description: project.description,
          long_description: project.longDescription || project.description,
          image: project.image,
          tags: project.tags,
          features: project.features,
          live_url: project.liveUrl || null,
          github_url: project.githubUrl || null,
          video_url: project.videoUrl || null,
          featured: Boolean(project.featured),
          display_order: project.displayOrder ?? 0,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("projects")
          .upsert(payload, { onConflict: "id" });

        if (error) {
          console.warn("[Direct client Supabase project notice]:", error.message);
        }
      } catch (err) {
        console.warn("[Direct client Supabase project sync error]:", err);
      }
    }

    return project;
  },

  async deleteProject(id: string): Promise<void> {
    const current = getLocal<ProjectItem[]>("projects", initialProjects);
    setLocal(
      "projects",
      current.filter((p) => p.id !== id),
    );

    // Call server delete
    try {
      await fetch(`/api/portfolio/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Server project delete error:", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) console.warn("[Supabase delete notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase delete sync error]:", err);
      }
    }
  },

  async reorderProjects(projects: ProjectItem[]): Promise<void> {
    const updated = projects.map((p, idx) => ({ ...p, displayOrder: idx + 1 }));
    setLocal("projects", updated);

    if (isSupabaseConfigured && supabase) {
      try {
        for (const p of updated) {
          await supabase
            .from("projects")
            .update({ display_order: p.displayOrder })
            .eq("id", p.id);
        }
      } catch (err) {
        console.warn("[Supabase reorder sync error]:", err);
      }
    }
  },

  // ==========================================
  // 2. EDUCATION
  // ==========================================
  async getEducation(): Promise<EducationItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("education")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            degree: r.degree,
            institute: r.institute,
            year: r.year,
            grade: r.grade,
            status: r.status,
            semester: r.semester,
            cgpa: r.cgpa,
            highlights: Array.isArray(r.highlights) ? r.highlights : [],
            description: r.description,
            displayOrder: r.display_order,
          }));
        }
      } catch (err) {
        console.warn("Supabase education fetch error:", err);
      }
    }
    return getLocal<EducationItem[]>("education", initialEducation);
  },

  async saveEducation(item: EducationItem): Promise<EducationItem> {
    const current = getLocal<EducationItem[]>("education", initialEducation);
    const idx = current.findIndex((e) => e.id === item.id);
    const updated = idx >= 0 ? [...current] : [...current, item];
    if (idx >= 0) updated[idx] = item;
    setLocal("education", updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: item.id,
          degree: item.degree,
          institute: item.institute,
          year: item.year,
          grade: item.grade,
          status: item.status,
          semester: item.semester || null,
          cgpa: item.cgpa || null,
          highlights: item.highlights || [],
          description: item.description || null,
          display_order: item.displayOrder ?? 0,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("education")
          .upsert(payload, { onConflict: "id" });
        if (error) console.warn("[Supabase education save notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase education sync error]:", err);
      }
    }
    return item;
  },

  async deleteEducation(id: string): Promise<void> {
    const current = getLocal<EducationItem[]>("education", initialEducation);
    setLocal(
      "education",
      current.filter((e) => e.id !== id),
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("education").delete().eq("id", id);
        if (error) console.warn("[Supabase education delete notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase education delete sync error]:", err);
      }
    }
  },

  // ==========================================
  // 3. EXPERIENCE
  // ==========================================
  async getExperience(): Promise<ExperienceItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("experience")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            company: r.company,
            role: r.role,
            duration: r.duration,
            type: r.type,
            description: r.description,
            keyResponsibilities: Array.isArray(r.key_responsibilities)
              ? r.key_responsibilities
              : [],
            technologies: Array.isArray(r.technologies) ? r.technologies : [],
            iconName: r.icon_name || "Briefcase",
            displayOrder: r.display_order,
          }));
        }
      } catch (err) {
        console.warn("Supabase experience fetch error:", err);
      }
    }
    return getLocal<ExperienceItem[]>("experience", initialExperience);
  },

  async saveExperience(item: ExperienceItem): Promise<ExperienceItem> {
    const current = getLocal<ExperienceItem[]>("experience", initialExperience);
    const idx = current.findIndex((e) => e.id === item.id);
    const updated = idx >= 0 ? [...current] : [...current, item];
    if (idx >= 0) updated[idx] = item;
    setLocal("experience", updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: item.id,
          company: item.company,
          role: item.role,
          duration: item.duration,
          type: item.type,
          description: item.description,
          key_responsibilities: item.keyResponsibilities || [],
          technologies: item.technologies || [],
          icon_name: item.iconName || "Briefcase",
          display_order: item.displayOrder ?? 0,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("experience")
          .upsert(payload, { onConflict: "id" });
        if (error) console.warn("[Supabase experience save notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase experience sync error]:", err);
      }
    }
    return item;
  },

  async deleteExperience(id: string): Promise<void> {
    const current = getLocal<ExperienceItem[]>("experience", initialExperience);
    setLocal(
      "experience",
      current.filter((e) => e.id !== id),
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("experience").delete().eq("id", id);
        if (error) console.warn("[Supabase experience delete notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase experience delete sync error]:", err);
      }
    }
  },

  // ==========================================
  // 4. CREDENTIALS / CERTIFICATES
  // ==========================================
  async getCredentials(): Promise<CredentialItem[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("credentials")
          .select("*")
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            issuer: r.issuer,
            date: r.date,
            credentialId: r.credential_id || undefined,
            skillsLearned: Array.isArray(r.skills_learned) ? r.skills_learned : [],
            category: r.category,
            imageThumbnail: r.image_thumbnail,
            fileUrl: r.file_url || undefined,
            displayOrder: r.display_order,
          }));
        }
      } catch (err) {
        console.warn("Supabase credentials fetch error:", err);
      }
    }
    return getLocal<CredentialItem[]>("credentials", initialCredentials);
  },

  async saveCredential(item: CredentialItem): Promise<CredentialItem> {
    const current = getLocal<CredentialItem[]>("credentials", initialCredentials);
    const idx = current.findIndex((c) => c.id === item.id);
    const updated = idx >= 0 ? [...current] : [...current, item];
    if (idx >= 0) updated[idx] = item;
    setLocal("credentials", updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          date: item.date,
          credential_id: item.credentialId || null,
          skills_learned: item.skillsLearned || [],
          category: item.category,
          image_thumbnail: item.imageThumbnail,
          file_url: item.fileUrl || null,
          display_order: item.displayOrder ?? 0,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("credentials")
          .upsert(payload, { onConflict: "id" });
        if (error) console.warn("[Supabase credential save notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase credential sync error]:", err);
      }
    }
    return item;
  },

  async deleteCredential(id: string): Promise<void> {
    const current = getLocal<CredentialItem[]>("credentials", initialCredentials);
    setLocal(
      "credentials",
      current.filter((c) => c.id !== id),
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("credentials").delete().eq("id", id);
        if (error) console.warn("[Supabase credential delete notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase credential delete sync error]:", err);
      }
    }
  },

  // ==========================================
  // 5. SKILLS & CATEGORIES
  // ==========================================
  async getSkillCategories(): Promise<SkillCategory[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: cats, error: catErr } = await supabase
          .from("skill_categories")
          .select("*")
          .order("display_order", { ascending: true });

        const { data: skills, error: skillErr } = await supabase
          .from("skills")
          .select("*")
          .order("display_order", { ascending: true });

        if (!catErr && !skillErr && cats && cats.length > 0) {
          return cats.map((c: any) => ({
            id: c.id,
            category: c.category,
            displayOrder: c.display_order,
            skills: (skills || [])
              .filter((s: any) => s.category_name === c.category || s.category_id === c.id)
              .map((s: any) => ({
                id: s.id,
                name: s.name,
                level: s.level,
                icon: s.icon,
                description: s.description,
                displayOrder: s.display_order,
              })),
          }));
        }
      } catch (err) {
        console.warn("Supabase skills fetch error:", err);
      }
    }
    return getLocal<SkillCategory[]>("skill_categories", initialSkillCategories);
  },

  async saveSkillCategories(categories: SkillCategory[]): Promise<void> {
    setLocal("skill_categories", categories);

    if (isSupabaseConfigured && supabase) {
      try {
        for (const [catIdx, cat] of categories.entries()) {
          const catId = cat.id || `cat-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
          await supabase.from("skill_categories").upsert({
            id: catId,
            category: cat.category,
            display_order: catIdx + 1,
          });

          for (const [skillIdx, skill] of cat.skills.entries()) {
            const skillId = skill.id || `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            await supabase.from("skills").upsert({
              id: skillId,
              category_id: catId,
              category_name: cat.category,
              name: skill.name,
              level: skill.level,
              description: skill.description || null,
              icon: skill.icon || null,
              display_order: skillIdx + 1,
            });
          }
        }
      } catch (err) {
        console.warn("[Supabase skills sync error]:", err);
      }
    }
  },

  // ==========================================
  // 6. PERSONAL PROFILE
  // ==========================================
  async getProfile(): Promise<PersonalInfo> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("personal_profile")
          .select("*")
          .eq("id", "main")
          .maybeSingle();

        if (!error && data) {
          return {
            name: data.name,
            titles: Array.isArray(data.titles) ? data.titles : initialPersonalInfo.titles,
            bio: data.bio,
            quote: data.quote,
            quoteAuthor: data.quote_author,
            email: data.email,
            phone1: data.phone1,
            phone2: data.phone2,
            location: data.location,
            age: data.age,
            gender: data.gender,
            religion: data.religion,
            nationality: data.nationality,
            maritalStatus: data.marital_status,
            profileImage: data.profile_image,
            resumeUrl: data.resume_url,
            languages: Array.isArray(data.languages) ? data.languages : initialPersonalInfo.languages,
            socials: data.socials || initialPersonalInfo.socials,
            stats: Array.isArray(data.stats) ? data.stats : initialPersonalInfo.stats,
            goals: Array.isArray(data.goals) ? data.goals : initialPersonalInfo.goals,
          };
        }
      } catch (err) {
        console.warn("Supabase profile fetch error:", err);
      }
    }
    return getLocal<PersonalInfo>("profile", initialPersonalInfo);
  },

  async saveProfile(profile: PersonalInfo): Promise<PersonalInfo> {
    setLocal("profile", profile);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: "main",
          name: profile.name,
          titles: profile.titles,
          bio: profile.bio,
          quote: profile.quote,
          quote_author: profile.quoteAuthor,
          email: profile.email,
          phone1: profile.phone1,
          phone2: profile.phone2,
          location: profile.location,
          age: profile.age,
          gender: profile.gender,
          religion: profile.religion,
          nationality: profile.nationality,
          marital_status: profile.maritalStatus,
          profile_image: profile.profileImage,
          resume_url: profile.resumeUrl,
          languages: profile.languages,
          socials: profile.socials,
          stats: profile.stats,
          goals: profile.goals,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("personal_profile")
          .upsert(payload, { onConflict: "id" });
        if (error) console.warn("[Supabase profile save notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase profile sync error]:", err);
      }
    }
    return profile;
  },

  // ==========================================
  // 7. DOCUMENTS & CV
  // ==========================================
  async getDocuments(): Promise<DocumentItem[]> {
    const defaultDocs: DocumentItem[] = [
      {
        id: "doc-cv",
        title: "Hafsa Saeed Official Curriculum Vitae",
        description: "BS Computer Science & Full Stack Web Developer Resume",
        category: "cv",
        fileUrl: initialPersonalInfo.resumeUrl || "/Hafsa_Saeed_CV.pdf",
        fileName: "Hafsa_Saeed_CV.pdf",
        isActiveCv: true,
      },
    ];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .order("updated_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            category: r.category,
            fileUrl: r.file_url,
            r2Key: r.r2_key,
            fileName: r.file_name,
            fileSize: r.file_size,
            mimeType: r.mime_type,
            isActiveCv: r.is_active_cv,
            updatedAt: r.updated_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase documents fetch error:", err);
      }
    }
    return getLocal<DocumentItem[]>("documents", defaultDocs);
  },

  async saveDocument(doc: DocumentItem): Promise<DocumentItem> {
    const current = getLocal<DocumentItem[]>("documents", []);
    const idx = current.findIndex((d) => d.id === doc.id);
    let updated = idx >= 0 ? [...current] : [...current, doc];
    if (idx >= 0) updated[idx] = doc;
    if (doc.isActiveCv) {
      updated = updated.map((d) => (d.id === doc.id ? d : { ...d, isActiveCv: false }));
      // Also update cached profile resumeUrl
      const prof = getLocal<PersonalInfo>("profile", initialPersonalInfo);
      setLocal("profile", { ...prof, resumeUrl: doc.fileUrl });
    }
    setLocal("documents", updated);

    if (isSupabaseConfigured && supabase) {
      try {
        if (doc.isActiveCv) {
          // Demote previous active CVs
          await supabase
            .from("documents")
            .update({ is_active_cv: false })
            .eq("category", "cv");

          // Also update personal_profile resume_url
          await supabase
            .from("personal_profile")
            .update({ resume_url: doc.fileUrl })
            .eq("id", "main");
        }

        const payload = {
          id: doc.id,
          title: doc.title,
          description: doc.description || null,
          category: doc.category,
          file_url: doc.fileUrl,
          r2_key: doc.r2Key || null,
          file_name: doc.fileName || null,
          file_size: doc.fileSize || null,
          mime_type: doc.mimeType || null,
          is_active_cv: Boolean(doc.isActiveCv),
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase
          .from("documents")
          .upsert(payload, { onConflict: "id" });
        if (error) console.warn("[Supabase document save notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase document sync error]:", err);
      }
    }

    return doc;
  },

  async deleteDocument(id: string): Promise<void> {
    const current = getLocal<DocumentItem[]>("documents", []);
    setLocal(
      "documents",
      current.filter((d) => d.id !== id),
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("documents").delete().eq("id", id);
        if (error) console.warn("[Supabase document delete notice]:", error.message);
      } catch (err) {
        console.warn("[Supabase document delete sync error]:", err);
      }
    }
  },

  // ==========================================
  // 8. CONTACT MESSAGES (Private to Admin)
  // ==========================================
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            subject: r.subject,
            message: r.message,
            isRead: r.is_read,
            deliveredViaSmtp: r.delivered_via_smtp,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase messages fetch error:", err);
      }
    }

    // Try fetching from server memory/archive endpoint if Supabase is offline
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const json = await res.json();
        if (json.messages && Array.isArray(json.messages)) {
          return json.messages.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            isRead: false,
            deliveredViaSmtp: m.deliveredViaSMTP,
            createdAt: m.createdAt,
          }));
        }
      }
    } catch (e) {
      // ignore
    }

    return getLocal<ContactMessage[]>("messages", []);
  },

  async markMessageRead(id: string, isRead: boolean = true): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("contact_messages")
        .update({ is_read: isRead })
        .eq("id", id);
    }
    const current = getLocal<ContactMessage[]>("messages", []);
    setLocal(
      "messages",
      current.map((m) => (m.id === id ? { ...m, isRead } : m)),
    );
  },

  async deleteMessage(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from("contact_messages").delete().eq("id", id);
    }
    const current = getLocal<ContactMessage[]>("messages", []);
    setLocal(
      "messages",
      current.filter((m) => m.id !== id),
    );
  },

  // ==========================================
  // 9. ONE-CLICK DATA MIGRATION TO SUPABASE
  // ==========================================
  async syncInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message:
          "Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured.",
      };
    }

    try {
      // Preflight table existence check
      const { error: testErr } = await supabase.from("projects").select("id").limit(1);
      if (testErr) {
        const msg = testErr.message || "";
        if (
          testErr.code === "PGRST205" ||
          msg.toLowerCase().includes("schema cache") ||
          msg.toLowerCase().includes("could not find the table")
        ) {
          return {
            success: false,
            message:
              "The PostgreSQL tables do not exist in your Supabase project yet. Please copy the SQL from supabase-schema.sql, run it once in your Supabase SQL Editor, and then click this button again!",
          };
        }
      }

      // 1. Sync Profile
      const prof = await this.getProfile();
      await this.saveProfile(prof);

      // 2. Sync Projects
      const projects = await this.getProjects();
      for (const p of projects) {
        await this.saveProject(p);
      }

      // 3. Sync Education
      const edus = await this.getEducation();
      for (const e of edus) {
        await this.saveEducation(e);
      }

      // 4. Sync Experience
      const exps = await this.getExperience();
      for (const ex of exps) {
        await this.saveExperience(ex);
      }

      // 5. Sync Credentials
      const creds = await this.getCredentials();
      for (const c of creds) {
        await this.saveCredential(c);
      }

      // 6. Sync Skills
      const skillCats = await this.getSkillCategories();
      await this.saveSkillCategories(skillCats);

      // 7. Sync Documents
      const docs = await this.getDocuments();
      for (const d of docs) {
        await this.saveDocument(d);
      }

      return {
        success: true,
        message: `Successfully synchronized all ${projects.length} projects, education records, skills, and profile data into Supabase PostgreSQL tables!`,
      };
    } catch (err: any) {
      console.error("Migration error:", err);
      return {
        success: false,
        message: `Migration failed: ${err.message || String(err)}`,
      };
    }
  },
};
