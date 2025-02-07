import { ServerResponse, UserProfile } from "../../types/mypage";

export const mapServerResponseToUserProfile = (
  data: ServerResponse
): UserProfile => {
  return {
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    profileImage: data.profileImage,
    height: data.height,
    weight: data.weight,
    position: data.position,
    level: data.level,
    mannerScore: data.mannerScore,
    socialProvider: null,
    lastLoginAt: data.lastLoginAt || data.createdAt,
  };
};
