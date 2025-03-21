import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useState, useContext } from "react";
import SignupLink from "../signup/SignupLink";
import { handleLogin } from "../../../utils/auth/handleLogin";
import { useRouter } from "expo-router";
import { AuthContext } from "../../../../app/_layout";

const LoginForm = () => {
  const router = useRouter(); // 변경
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // AuthContext에서 setIsLoggedIn 가져오기
  const authContext = useContext(AuthContext);
  const setIsLoggedIn = authContext ? authContext.setIsLoggedIn : null;

  const onLoginPress = async () => {
    const shouldNavigate = true;
    const success = await handleLogin({
      email,
      password,
      router,
      onError: setError,
      shouldNavigate,
      onSuccess: () => {
        // 로그인 성공 시 AuthContext 상태 업데이트
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }
      },
    });
  };

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subTitle}>
          PICKUP과 함께 새로운 농구 친구를 만나보세요.
        </Text>
      </View>

      {/* 이메일 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="example@naver.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* 비밀번호 입력 */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <Eye size={20} color="#666" />
            ) : (
              <EyeOff size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* 에러 메시지 표시 */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 로그인 상태 유지 & 비밀번호 찾기 */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 구분선 */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>또는</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* 소셜 로그인 버튼들 */}
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.socialButtonText}>Google로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
        <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
      </TouchableOpacity>

      <SignupLink />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    paddingTop: 0,
    width: "100%",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitle: {
    color: "#999",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#999",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#666",
  },
  rememberText: {
    color: "#fff",
    fontSize: 14,
  },
  forgotPassword: {
    color: "#ff6b00",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#666",
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  socialButton: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
});

export default LoginForm;
