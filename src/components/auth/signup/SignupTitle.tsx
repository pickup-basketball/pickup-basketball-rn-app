import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SignupTitle = ({ step }: { step: number }) => {
  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>회원가입</Text>
        {step === 1 ? (
          <Text style={styles.subtitle}>기본 정보를 입력해주세요.</Text>
        ) : (
          <Text style={styles.subtitle}>농구 관련 정보를 입력해주세요.</Text>
        )}
      </View>

      <View style={styles.signupStageContainer}>
        {[1, 2].map((index) => (
          <View
            key={index}
            style={
              step === index ? styles.currentSignupStage : styles.signupStage
            }
          />
        ))}
      </View>
    </>
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

export default SignupTitle;
