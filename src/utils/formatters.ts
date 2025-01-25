import { Level } from "../types/match";

export const formatLevel = (level: Level) =>
  ({
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "상급",
  }[level]);

export const getLevelStyle = (level: Level) => ({
  color: {
    BEGINNER: "#4ADE80",
    INTERMEDIATE: "#EAB308",
    ADVANCED: "#EF4444",
  }[level],
});
