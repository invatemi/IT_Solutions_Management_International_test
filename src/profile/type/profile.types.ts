export type ProfileRecord = {
  id: number;
  name: string;
  description: string;
};

export type LinkRecord = {
  label: string;
  url: string;
};

export type SkillRecord = {
  name: string;
};

export type ExperienceRecord = {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
};

export type ProjectRecord = {
  name: string;
  url: string;
};
