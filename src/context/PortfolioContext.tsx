import React, { createContext, useContext, useState, useEffect } from "react";
import { portfolioService } from "../services/portfolioService";
import {
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
} from "../types";
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

interface PortfolioContextType {
  personalInfo: PersonalInfo;
  projectsList: ProjectItem[];
  educationList: EducationItem[];
  experienceList: ExperienceItem[];
  skillCategories: SkillCategory[];
  circularSkills: CircularSkill[];
  credentialsList: CredentialItem[];
  hobbiesList: HobbyItem[];
  documentsList: DocumentItem[];
  messagesList: ContactMessage[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updatePersonalInfo: (info: PersonalInfo) => Promise<void>;
  saveProject: (project: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (projects: ProjectItem[]) => Promise<void>;
  saveEducation: (item: EducationItem) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  saveExperience: (item: ExperienceItem) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  saveCredential: (item: CredentialItem) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  saveSkillCategories: (cats: SkillCategory[]) => Promise<void>;
  saveDocument: (doc: DocumentItem) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [educationList, setEducationList] = useState<EducationItem[]>(initialEducation);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(initialExperience);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(initialSkillCategories);
  const [circularSkills, setCircularSkills] = useState<CircularSkill[]>(initialCircularSkills);
  const [credentialsList, setCredentialsList] = useState<CredentialItem[]>(initialCredentials);
  const [hobbiesList] = useState<HobbyItem[]>(initialHobbies);
  const [documentsList, setDocumentsList] = useState<DocumentItem[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const [
        projs,
        edus,
        exps,
        creds,
        cats,
        profile,
        docs,
        msgs,
      ] = await Promise.all([
        portfolioService.getProjects(),
        portfolioService.getEducation(),
        portfolioService.getExperience(),
        portfolioService.getCredentials(),
        portfolioService.getSkillCategories(),
        portfolioService.getProfile(),
        portfolioService.getDocuments(),
        portfolioService.getMessages(),
      ]);

      setProjectsList(projs);
      setEducationList(edus);
      setExperienceList(exps);
      setCredentialsList(creds);
      setSkillCategories(cats);
      setPersonalInfo(profile);
      setDocumentsList(docs);
      setMessagesList(msgs);
    } catch (e) {
      console.warn("Portfolio data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updatePersonalInfo = async (info: PersonalInfo) => {
    setPersonalInfo(info);
    await portfolioService.saveProfile(info);
  };

  const saveProject = async (project: ProjectItem) => {
    await portfolioService.saveProject(project);
    await refreshData();
  };

  const deleteProject = async (id: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    await portfolioService.deleteProject(id);
    await refreshData();
  };

  const reorderProjects = async (projects: ProjectItem[]) => {
    setProjectsList(projects);
    await portfolioService.reorderProjects(projects);
  };

  const saveEducation = async (item: EducationItem) => {
    await portfolioService.saveEducation(item);
    await refreshData();
  };

  const deleteEducation = async (id: string) => {
    setEducationList((prev) => prev.filter((e) => e.id !== id));
    await portfolioService.deleteEducation(id);
    await refreshData();
  };

  const saveExperience = async (item: ExperienceItem) => {
    await portfolioService.saveExperience(item);
    await refreshData();
  };

  const deleteExperience = async (id: string) => {
    setExperienceList((prev) => prev.filter((e) => e.id !== id));
    await portfolioService.deleteExperience(id);
    await refreshData();
  };

  const saveCredential = async (item: CredentialItem) => {
    await portfolioService.saveCredential(item);
    await refreshData();
  };

  const deleteCredential = async (id: string) => {
    setCredentialsList((prev) => prev.filter((c) => c.id !== id));
    await portfolioService.deleteCredential(id);
    await refreshData();
  };

  const saveSkillCategories = async (cats: SkillCategory[]) => {
    setSkillCategories(cats);
    await portfolioService.saveSkillCategories(cats);
  };

  const saveDocument = async (doc: DocumentItem) => {
    await portfolioService.saveDocument(doc);
    await refreshData();
  };

  const deleteDocument = async (id: string) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== id));
    await portfolioService.deleteDocument(id);
    await refreshData();
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        projectsList,
        educationList,
        experienceList,
        skillCategories,
        circularSkills,
        credentialsList,
        hobbiesList,
        documentsList,
        messagesList,
        loading,
        refreshData,
        updatePersonalInfo,
        saveProject,
        deleteProject,
        reorderProjects,
        saveEducation,
        deleteEducation,
        saveExperience,
        deleteExperience,
        saveCredential,
        deleteCredential,
        saveSkillCategories,
        saveDocument,
        deleteDocument,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
