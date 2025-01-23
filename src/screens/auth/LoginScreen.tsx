import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LoginForm from "../../components/auth/LoginForm";
import Header from "../../components/common/Header";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
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
