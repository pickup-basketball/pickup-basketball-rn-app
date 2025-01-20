import React from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { ArrowLeft } from "lucide-react-native";
import LoginForm from "../../components/auth/LoginForm";

// 네비게이션에서 사용할 스크린들의 타입 정의
type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
};

// navigation 타입 정의
type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>(); // 타입 지정

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PICKUP</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Start")}
          style={styles.mainButton}
        >
          <View style={styles.buttonContent}>
            <ArrowLeft size={20} color="#fff" />
            <Text style={styles.mainButtonText}>메인으로</Text>
          </View>
        </TouchableOpacity>
      </View>

      <LoginForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  mainButton: {
    padding: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    bottom: 1,
  },
});

export default LoginScreen;
