import AsyncStorage from "@react-native-async-storage/async-storage";
import FCMTokenManager from "./useFCMToken";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../../app/_layout"; // 경로는 실제 위치에 맞게 조정

export const useLogout = () => {
  const { deleteFcmToken } = FCMTokenManager();
  const router = useRouter();
  // AuthContext에서 setIsLoggedIn 가져오기
  const authContext = useContext(AuthContext);
  const setIsLoggedIn = authContext ? authContext.setIsLoggedIn : null;

  const handleLogout = async () => {
    try {
      // AsyncStorage 데이터 제거
      await AsyncStorage.multiRemove([
        "jti",
        "isLoggedIn",
        "rememberLogin",
        "accessToken",
        "refreshToken",
        "userId",
      ]);

      // FCM 토큰 제거
      deleteFcmToken();

      // React 상태 업데이트 (중요!)
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }

      // 약간의 지연 후 라우팅 (AsyncStorage 변경이 반영될 시간 확보)
      setTimeout(() => {
        console.log("로그아웃 후 시작 화면으로 이동 시도");
        router.replace("/(auth)/start");
      }, 100);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return handleLogout;
};
