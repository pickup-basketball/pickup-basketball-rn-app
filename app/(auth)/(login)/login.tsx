import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LoginForm from "../../../src/components/auth/login/LoginForm";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default LoginScreen;
