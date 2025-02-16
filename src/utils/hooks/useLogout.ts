import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TNavigationProp } from "../../types/navigation";

export const useLogout = () => {
  const navigation = useNavigation<TNavigationProp>();

  const handleLogout = async () => {
    try {
      // 1. AsyncStorage 클리어
      await AsyncStorage.multiRemove([
        "isLoggedIn",
        "rememberLogin",
        "accessToken",
        "refreshToken",
      ]);

      // 2. Start 스크린으로 네비게이션
      navigation.reset({
        index: 0,
        routes: [{ name: "Start" }],
      });

      // 또는 App.tsx의 isLoggedIn state를 직접 업데이트하는 방법도 있습니다
      // setIsLoggedIn(false); // App 컴포넌트의 state를 업데이트
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return handleLogout;
};
