import { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { TSignupStep1Props, TStep1Form } from "../../../types/signup";
import { validateSignupStep1 } from "../../../utils/validators/signupValidator";
import { colors } from "../../../styles/colors";
import EmailVerificationInput from "../common/EmailVerificationInput";

const SignupStep1: React.FC<TSignupStep1Props> = ({ onNext }) => {
  const [formData, setFormData] = useState<TStep1Form>({
    email: "",
    password: "",
    nickname: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleSubmit = () => {
    if (!isEmailVerified || formData.email !== verifiedEmail) {
      setErrors(["이메일 중복 확인이 필요합니다."]);
      return;
    }
    const validationErrors = validateSignupStep1(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onNext(formData);
  };

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  const handleVerificationStatusChange = (
    isVerified: boolean,
    email: string
  ) => {
    setIsEmailVerified(isVerified);
    setVerifiedEmail(email);
  };

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <EmailVerificationInput
          email={formData.email}
          onEmailChange={handleEmailChange}
          onVerificationStatusChange={handleVerificationStatusChange}
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, password: text }))
          }
          placeholder="8자리 이상 입력해주세요"
          placeholderTextColor="#666"
          secureTextEntry
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="비밀번호를 다시 입력해주세요."
          placeholderTextColor="#666"
          secureTextEntry
        />

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.nickNameInput}
          value={formData.nickname}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, nickname: text }))
          }
          placeholder="사용하실 닉네임을 입력해주세요."
          placeholderTextColor="#A0A0A0"
        />
      </View>
      {errors.map((error, index) => (
        <Text key={index} style={styles.errorText}>
          {error}
        </Text>
      ))}
      <View style={styles.signupStageContainer}>
        <TouchableOpacity style={[styles.signupButton]} onPress={handleSubmit}>
          <Text style={styles.signupButtonText}>다음</Text>
        </TouchableOpacity>
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
    marginVertical: 8,
  },
  emailInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
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
    flex: 1,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
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
    lineHeight: 20,
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
    bottom: 1,
  },
  signupStageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 10,
  },
  currentSignupStage: {
    backgroundColor: colors.primary,
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },
  emailInputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default SignupStep1;
