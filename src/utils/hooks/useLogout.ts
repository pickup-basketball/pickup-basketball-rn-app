import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TNavigationProp } from "../../types/navigation";
import FCMTokenManager from "./useFCMToken";

export const useLogout = () => {
  const navigation = useNavigation<TNavigationProp>();
  const { deleteFcmToken } = FCMTokenManager();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "jti",
        "isLoggedIn",
        "rememberLogin",
        "accessToken",
        "refreshToken",
        "userId",
      ]);

      deleteFcmToken();

      navigation.reset({
        index: 0,
        routes: [{ name: "Start" }],
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return handleLogout;
};
