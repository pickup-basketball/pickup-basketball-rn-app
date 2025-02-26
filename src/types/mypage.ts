export type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  height: number;
  weight: number;
  position: string;
  level: string;
  mannerScore: number;
  updatedAt: string;
};

// 서버 응답과 UserProfile이 동일한 형태이므로 ServerResponse 타입도 같게 설정
export type ServerResponse = UserProfile;

// 서버 응답을 UserProfile 형태로 변환하는 함수
export const mapServerResponseToUserProfile = (
  data: ServerResponse
): UserProfile => {
  return {
    id: data.id,
    email: data.email,
    nickname: data.nickname,
    height: data.height,
    weight: data.weight,
    position: data.position,
    level: data.level,
    mannerScore: data.mannerScore,
    updatedAt: data.updatedAt,
  };
};
