import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import axiosInstance from "../../api/axios-interceptor";
import { UserProfile } from "../../types/mypage";
import { TNavigationProp } from "../../types/navigation";

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<TNavigationProp>();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/member/mypage");
      setUserProfile(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert("세션이 만료되었습니다", "다시 로그인해주세요");
        navigation.reset({
          index: 0,
          routes: [{ name: "Start" }],
        });
      }
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  return {
    userProfile,
    isLoading,
    fetchProfile,
  };
};
