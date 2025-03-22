import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "./_layout";

export default function NotFoundScreen() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;

  // 단순히 Redirect 컴포넌트를 사용하여 리디렉션
  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/start" />;
  }
}
