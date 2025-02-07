import { MatchParticipation } from "../types/match";
import axiosInstance from "./axios-interceptor";

export const fetchParticipations = async (): Promise<MatchParticipation[]> => {
  try {
    const response = await axiosInstance.get("/matches/participation");
    return response.data.data;
  } catch (error) {
    console.error("참여 매치 조회 실패:", error);
    return [];
  }
};
