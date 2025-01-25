type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Status = "OPEN" | "CLOSED";

type Match = {
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
};
type TPosition = {
  position: string;
  value: string;
};

export { Level, Status, Match, TPosition };
