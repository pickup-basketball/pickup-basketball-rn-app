type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Status = "OPEN" | "CLOSED";

type Post = {
  id: number;
  title: string;
  courtName: string;
  location: string;
  date: string;
  time: string;
  level: Level;
  currentPlayers: number;
  maxPlayers: number;
  cost: number;
  status: Status;
  description: string;
  rules?: string;
  hostId: number;
};

type TPosition = {
  position: string;
  value: string;
};

export { Level, Status, Post, TPosition };
