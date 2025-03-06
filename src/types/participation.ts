import { NavigationProp } from "@react-navigation/native";

// types/participation.ts
export type ParticipationDetail = {
  id: number;
  member: {
    nickname: string;
    level: string;
  };
  participation: {
    id: number;
    status: string;
    message: string;
  };
};

export type Match = {
  id: number;
  title: string;
  courtName: string;
  district: string;
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  status: string;
};

export type Participation = {
  match: Match;
  participations: ParticipationDetail[];
};

export type ParticipationListProps = {
  participations: Participation[];
  onUpdate?: () => void;
  navigation: NavigationProp<any>;
};
