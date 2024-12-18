export interface FormData {
  email: string;
  password: string;
}

export interface SkillFormData {
  id: string;
  category: string;
  name: string;
  logo: string;
}
export interface SkillsDbContextType {
  skills: SkillFormData[];
  addSkill: (skilldata: Omit<SkillFormData, "id">) => Promise<void>;
  updateSkill: (skill: SkillFormData) => Promise<void>;
}

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}
export interface ProjectFormData {
  id: string;
  type: string;
  date: Timestamp;
  category: string;
  title: string;
  resum: string;
  cover: string;
  pictures: string[];
  description: string;
  skills: SkillFormData[];
  githubLink: string;
  liveLink?: string;
}

export interface ProjectsDbContextType {
  projects: ProjectFormData[];
  addProject: (projectdata: Omit<ProjectFormData, "id">) => Promise<void>;
  updateProject: (project: ProjectFormData) => Promise<void>;
}

export interface ProjectsViewProps {
  theme: string;
  projects: ProjectFormData[];
}

export interface UpdatePageProps {
  params: ProjectFormData;
}

export interface FilterProps {
  handleFilter: (category: string) => void;
  categories: string[];
}

export interface HobbieFormData {
  id: string;
  category: string;
  title: string;
  resum: string;
  pictures: string[];
}

export interface HobbieDbContextType {
  hobbies: HobbieFormData[];
  addHobbie: (hobbiedata: Omit<HobbieFormData, "id">) => Promise<void>;
  updateHobbie: (hobbie: HobbieFormData) => Promise<void>;
}

export interface HobbiePageProps {
  params: HobbieFormData;
}