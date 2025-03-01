import { useEffect } from "react";
import { Alert } from "react-native";
import { useLogout } from "../../utils/hooks/useLogout";
import { authEventEmitter } from "../../utils/event";

export const LogoutHandler = () => {
  const handleLogout = useLogout();

  useEffect(() => {
    const logoutHandler = (message?: string) => {
      console.log("🔐 로그아웃 이벤트 수신");
      handleLogout();
      if (message) {
        Alert.alert("알림", message);
      }
    };

    authEventEmitter.addListener("logout", logoutHandler);
    return () => {
      authEventEmitter.removeListener("logout", logoutHandler);
    };
  }, [handleLogout]);

  return null;
};
