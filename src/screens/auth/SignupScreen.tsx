import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import SignupStep1 from "../../components/auth/signup/SignupStep1";
import SignupStep2 from "../../components/auth/signup/SignupStep2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TSignupData } from "../../types/signup";
import Header from "../../components/common/Header";
import SignupTitle from "../../components/auth/signup/SignupTitle";
import LoginLink from "../../components/auth/login/LoginLink";

// 네비게이션에서 사용할 스크린들의 타입 정의
export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
  Guide: undefined;
  Matching: undefined;
  Courts: undefined;
};

// 회원가입 1단계에서 입력 정보 타입
type TStep1Data = {
  email: string;
  password: string;
  nickname: string;
};

const SignupScreen = () => {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<TStep1Data | null>(null);

  const handleStep1Complete = (data: TStep1Data) => {
    setSignupData(data);
    setStep(2);
  };
  const handleSignup = async (data: TSignupData) => {
    return { success: true };
  };

  const handleSignupComplete = async (data: TSignupData) => {
    try {
      const result = await handleSignup(data);

      if (result.success) await AsyncStorage.setItem("isLoggedIn", "true");
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <SignupTitle step={step} />

        {step === 1 ? (
          <SignupStep1 onNext={handleStep1Complete} />
        ) : (
          <SignupStep2
            step1Data={signupData!}
            onPrevious={() => setStep(1)}
            onSubmit={handleSignupComplete}
          />
        )}
        <LoginLink />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButton: {
    color: "#fff",
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    marginTop: -10,
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 8,
  },
  nickNameInput: {
    backgroundColor: "#3E3E3E",
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  signButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  splitButton: {
    flex: 1,
  },
  previousButton: {
    backgroundColor: "#696969",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#ff6b00",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
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
  },
  signupStageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 10,
  },
  currentSignupStage: {
    backgroundColor: "#F97316",
    borderRadius: 10,
    height: 5,
    width: 20,
    flex: 1,
  },
  signupStage: {
    backgroundColor: "#8A410E",
    borderRadius: 10,
    height: 5,
    width: 20,
    flex: 1,
  },
});

export default SignupScreen;
