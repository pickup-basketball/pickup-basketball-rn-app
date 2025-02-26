export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Status = "OPEN" | "CLOSED";

export type Post = {
  id: number;
  title: string;
  description: string;
  courtName: string;
  district: string;
  locationDetail: string;
  date: string;
  time: string;
  level: Level;
  currentPlayers: number;
  maxPlayers: number;
  cost: number;
  rules: string;
  hostId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type TPosition = {
  position: string;
  value: string;
};

export type Match = {
  id: number;
  title: string;
  description: string;
  courtName: string;
  location: string;
  date: string;
  time: string;
  level: string;
  currentPlayers: number;
  maxPlayers: number;
  cost: number;
  rules: string;
  hostId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ParticipationMember = {
  email: string;
  nickname: string;
  profileImage: string | null;
  height: number;
  weight: number;
  position: string;
  level: string;
  mannerScore: number;
};

export type Participation = {
  id: number;
  userId: number;
  matchingId: number;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type MatchParticipation = {
  match: Match;
  participations: Array<{
    id: number;
    member: ParticipationMember;
    participation: Participation;
  }>;
};
