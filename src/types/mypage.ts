export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  height: number | null;
  weight: number | null;
  position: string | null;
  level: string | null;
  mannerScore: number;
  socialProvider: string | null;
  lastLoginAt: string;
};

export type ServerResponse = {
  createdAt: string;
  email: string;
  height: number | null;
  id: number;
  lastLoginAt: string | null;
  level: string | null;
  mannerScore: number;
  nickname: string;
  password: string;
  position: string | null;
  profileImage: string | null;
  updatedAt: string;
  weight: number | null;
};

// 서버 응답을 UserProfile 형태로 변환하는 함수
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
    socialProvider: null, // 서버 응답에 없는 필드는 기본값 설정
    lastLoginAt: data.lastLoginAt || data.createdAt, // lastLoginAt이 없으면 createdAt 사용
  };
};
