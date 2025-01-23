import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen, {
  RootStackParamList,
} from "./src/screens/auth/SignupScreen";
import MatchingScreen from "./src/screens/main/MatchingScreen";
import CourtsScreen from "./src/screens/main/CourtsScreen";
import GuideScreen from "./src/screens/main/GuideScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // 앱 시작시 로그인 상태 체크
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    try {
      const [loginState, introState] = await Promise.all([
        AsyncStorage.getItem("isLoggedIn"),
        AsyncStorage.getItem("hasSeenIntro"),
      ]);

      setIsLoggedIn(loginState === "true");
      setHasSeenIntro(introState === "true");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // 로딩 화면 표시
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* {isLoggedIn ? (
          // 로그인된 상태 */}
        <>
          <Stack.Screen
            name="Guide"
            component={GuideScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Matching"
            component={MatchingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Courts"
            component={CourtsScreen}
            options={{ headerShown: false }}
          />
        </>
        {/* ) : (
          // 비로그인 상태 */}
        <>
          {!hasSeenIntro && (
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
