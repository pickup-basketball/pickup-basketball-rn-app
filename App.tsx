import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import { MainTabNavigator } from "./src/navigation/MainTabNavigator";
import { RootStackParamList } from "./src/types/navigation";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // asyncStorage 비울 때
  // useEffect(() => {
  //   const clearStorage = async () => {
  //     await AsyncStorage.clear();
  //     console.log("Storage cleared");
  //   };
  //   clearStorage();
  // }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const [loginStatus, rememberLogin] = await AsyncStorage.multiGet([
          "isLoggedIn",
          "rememberLogin",
        ]);

        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);
        console.log("All AsyncStorage Items:", JSON.stringify(items, null, 2));

        if (rememberLogin[1] !== "true") {
          await AsyncStorage.setItem("isLoggedIn", "false");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(loginStatus[1] === "true");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoading(false);
      }
    };

    // 초기 체크만 수행
    checkLoginStatus();
  }, []); // interval 제거

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {/* 추후에 로그인 여부로 route방식 변경 예정 */}
      <Stack.Navigator initialRouteName={isLoggedIn ? "MainTab" : "Login"}>
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
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
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
