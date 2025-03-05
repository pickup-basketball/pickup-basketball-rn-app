import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert } from "react-native";
import SignupStep1 from "../../components/auth/signup/SignupStep1";
import SignupStep2 from "../../components/auth/signup/SignupStep2";
import { TSignupForm } from "../../types/signup";
import Header from "../../components/common/Header";
import SignupTitle from "../../components/auth/signup/SignupTitle";
import LoginLink from "../../components/auth/login/LoginLink";
import axiosInstance from "../../api/axios-interceptor";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import { handleLogin } from "../../utils/auth/handleLogin";
import { LoginSuccessModal } from "../../components/auth/login/LoginSuccessModal";

type TStep1Data = {
  email: string;
  password: string;
  nickname: string;
};

const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<TStep1Data | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleStep1Complete = (data: TStep1Data) => {
    setSignupData(data);
    setStep(2);
  };

  const handleSignup = async (data: TSignupForm) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        height: Number(data.height),
        weight: Number(data.weight),
        position: data.position,
        level: data.level,
      };

      const response = await axiosInstance.post("/member", payload);

      if (response.status === 201 || response.status === 200) {
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("회원가입 API 요청 실패:", error);
      return { success: false };
    }
  };

  const handleSignupComplete = async (data: TSignupForm) => {
    try {
      const result = await handleSignup(data);

      if (result.success) {
        const loginResult = await handleLogin({
          email: data.email,
          password: data.password,
          navigation,
          axiosInstance,
          shouldNavigate: false,
          onError: (message) => {
            console.error("자동 로그인 실패:", message);
            Alert.alert(
              "로그인 오류",
              "회원가입은 완료되었으나 자동 로그인에 실패했습니다. 다시 로그인해주세요."
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
          onSuccess: () => {
            setShowSuccessModal(true);
          },
        });

        if (!loginResult) {
          navigation.navigate("Login");
        }
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      Alert.alert("오류 발생", "잠시 후 다시 시도해주세요.");
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTab", params: { screen: "Guide" } }],
    });
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

      <LoginSuccessModal
        visible={showSuccessModal}
        onClose={handleModalClose}
      />
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
