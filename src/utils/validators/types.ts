export type TFormData = {
  title: string;
  description: string;
  courtName: string;
  location: string;
  date: string;
  time: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxPlayers: number;
  cost: number;
  rules: string[];
};
