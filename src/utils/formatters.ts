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
