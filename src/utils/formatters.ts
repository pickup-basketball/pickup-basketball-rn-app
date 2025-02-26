import { Level } from "../types/match";
import { colors } from "../styles/colors";

export const formatLevel = (level: Level) =>
  ({
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "상급",
  }[level]);

export const getLevelStyle = (level: Level) =>
  ({
    BEGINNER: colors.level.beginner,
    INTERMEDIATE: colors.level.intermediate,
    ADVANCED: colors.level.advanced,
  }[level]);

export const getLevelColor = (level: string) =>
  ({
    BEGINNER: colors.level.beginner,
    INTERMEDIATE: colors.level.intermediate,
    ADVANCED: colors.level.advanced,
  }[level] || colors.grey.medium);

export const getPositionText = (position: string | null) =>
  ({
    PG: "포인트 가드",
    SG: "슈팅 가드",
    SF: "스몰 포워드",
    PF: "파워 포워드",
    C: "센터",
  }[position || ""] || "미설정");

export const getLevelText = (level: string | null) =>
  level ? `${level}` : "미설정";
