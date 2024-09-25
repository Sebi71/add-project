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

export interface DbContextType {
  skills: SkillFormData[];
  addSkill: (skilldata: Omit<SkillFormData, "id">) => Promise<void>;
  updateSkill: (skill: SkillFormData) => Promise<void>;
}
