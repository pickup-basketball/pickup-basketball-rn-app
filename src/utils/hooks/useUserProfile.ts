// hooks/useUserProfile.ts
import { useState, useCallback } from "react";
import axiosInstance from "../../api/axios-interceptor";
import { mapServerResponseToUserProfile } from "../mappers/userMapper";
import { UserProfile } from "../../types/mypage";

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/member/mypage");
      const mappedProfile = mapServerResponseToUserProfile(response.data.data);
      setUserProfile(mappedProfile);
    } catch (error) {
      console.error("프로필 조회 실패:", error);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    userProfile,
    isLoading,
    fetchProfile,
  };
};
