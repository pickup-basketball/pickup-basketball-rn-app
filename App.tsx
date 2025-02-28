import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { MainTabNavigator } from "./src/navigation/MainTabNavigator";
import { RootStackParamList } from "./src/types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const [loginStatus, token, refresh] = await AsyncStorage.multiGet([
          "isLoggedIn",
          "accessToken",
          "refresh",
        ]);
        console.log("accessToken:", token);
        console.log("refreshToken:", refresh);
        if (loginStatus[1] === "true" && token[1]) {
          setIsLoggedIn(true);
        } else {
          await AsyncStorage.multiRemove([
            "isLoggedIn",
            "accessToken",
            "refreshToken",
            "jti",
          ]);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? "MainTab" : "Start"}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTab" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
