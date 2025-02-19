export type TFormData = {
  title: string;
  description: string;
  courtName: string;
  district: string;
  locationDetail: string;
  date: string;
  time: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxPlayers: number;
  cost: number;
  rules: string[];
};
