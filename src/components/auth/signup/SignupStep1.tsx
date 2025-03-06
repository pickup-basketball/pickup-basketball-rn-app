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
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const validateForm = () => {
    const validationErrors: string[] = [];

    // 이메일 인증 확인
    if (!isEmailVerified || formData.email !== verifiedEmail) {
      validationErrors.push("이메일 중복 확인이 필요합니다.");
    }

    // 필수 필드 입력 확인
    if (!formData.password) {
      validationErrors.push("비밀번호를 입력해주세요.");
    }

    if (!passwordConfirm) {
      validationErrors.push("비밀번호 확인을 입력해주세요.");
    }

    // 비밀번호 일치 확인
    if (
      formData.password &&
      passwordConfirm &&
      formData.password !== passwordConfirm
    ) {
      validationErrors.push("비밀번호가 일치하지 않습니다.");
    }

    // 기존 validateSignupStep1 함수를 통한 유효성 검증
    const basicErrors = validateSignupStep1(formData);

    // 모든 에러 합치기
    return [...validationErrors, ...basicErrors];
  };

  const handleSubmit = () => {
    // 모든 필드를 터치된 상태로 설정 (에러 표시 목적)
    setTouchedFields({
      email: true,
      password: true,
      passwordConfirm: true,
      nickname: true,
    });

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    // 검증 통과, 다음 단계로 진행
    setErrors([]);
    onNext(formData);
  };

  const handleEmailChange = (email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    setTouchedFields((prev) => ({ ...prev, email: true }));
  };

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    setTouchedFields((prev) => ({ ...prev, password: true }));

    // 비밀번호 변경 시 에러 메시지 갱신
    if (touchedFields.passwordConfirm && password !== passwordConfirm) {
      setErrors((prev) => {
        if (!prev.includes("비밀번호가 일치하지 않습니다.")) {
          return [...prev, "비밀번호가 일치하지 않습니다."];
        }
        return prev;
      });
    } else if (touchedFields.passwordConfirm && password === passwordConfirm) {
      setErrors((prev) =>
        prev.filter((error) => error !== "비밀번호가 일치하지 않습니다.")
      );
    }
  };

  const handlePasswordConfirmChange = (text: string) => {
    setPasswordConfirm(text);
    setTouchedFields((prev) => ({ ...prev, passwordConfirm: true }));

    // 비밀번호 확인 변경 시 에러 메시지 갱신
    if (formData.password !== text) {
      setErrors((prev) => {
        if (!prev.includes("비밀번호가 일치하지 않습니다.")) {
          return [...prev, "비밀번호가 일치하지 않습니다."];
        }
        return prev;
      });
    } else {
      setErrors((prev) =>
        prev.filter((error) => error !== "비밀번호가 일치하지 않습니다.")
      );
    }
  };

  const handleNicknameChange = (nickname: string) => {
    setFormData((prev) => ({ ...prev, nickname }));
    setTouchedFields((prev) => ({ ...prev, nickname: true }));
  };

  const handleVerificationStatusChange = (
    isVerified: boolean,
    email: string
  ) => {
    setIsEmailVerified(isVerified);
    setVerifiedEmail(email);

    // 이메일 인증 상태 변경 시 에러 메시지 갱신
    if (isVerified) {
      setErrors((prev) =>
        prev.filter((error) => !error.includes("이메일 중복"))
      );
    }
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
          style={[
            styles.input,
            touchedFields.password && !formData.password
              ? styles.inputError
              : null,
          ]}
          value={formData.password}
          onChangeText={handlePasswordChange}
          placeholder="8자리 이상 입력해주세요"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          selectionColor={colors.primary}
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={[
            styles.input,
            (touchedFields.passwordConfirm && !passwordConfirm) ||
            (touchedFields.passwordConfirm &&
              formData.password !== passwordConfirm)
              ? styles.inputError
              : null,
          ]}
          value={passwordConfirm}
          onChangeText={handlePasswordConfirmChange}
          placeholder="비밀번호를 다시 입력해주세요."
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          selectionColor={colors.primary}
        />

        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={[
            styles.input,
            touchedFields.nickname && !formData.nickname
              ? styles.inputError
              : null,
          ]}
          value={formData.nickname}
          onChangeText={handleNicknameChange}
          placeholder="사용하실 닉네임을 입력해주세요."
          placeholderTextColor="#A0A0A0"
          selectionColor={colors.primary}
        />
      </View>

      {/* 에러 메시지 표시 */}
      {errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

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
  inputContainer: {},
  label: {
    color: "#666",
    marginVertical: 8,
  },
  emailInput: {
    flex: 1,
    backgroundColor: "#3E3E3E",
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
    color: "#fff",
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 50,
    color: colors.primary,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#FF7A7A",
    borderWidth: 1.5,
  },
  errorsContainer: {
    backgroundColor: "rgba(255, 122, 122, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 122, 122, 0.2)",
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
    marginTop: 10,
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
    color: colors.primary,
    fontSize: 14,
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
