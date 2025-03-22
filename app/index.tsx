import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "./_layout";

export default function Index() {
  const authContext = useContext(AuthContext);

  // 로그인 상태에 따라 리디렉션만 처리 (사이드 이펙트 제거)
  if (!authContext) {
    return null; // 컨텍스트가 아직 준비되지 않음
  }

  const { isLoggedIn } = authContext;

  if (isLoggedIn) {
    console.log("루트 인덱스 - 로그인됨, 탭으로 이동");
    return <Redirect href="/(tabs)" />;
  } else {
    console.log("루트 인덱스 - 로그인 안됨, 시작 화면으로 이동");
    return <Redirect href="/(auth)/start" />;
  }
}
