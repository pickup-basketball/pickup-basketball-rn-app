import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TNavigationProp } from "../../types/navigation";

export const useLogout = () => {
  const navigation = useNavigation<TNavigationProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "isLoggedIn",
        "rememberLogin",
        "accessToken",
        "refreshToken",
      ]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return handleLogout;
};
