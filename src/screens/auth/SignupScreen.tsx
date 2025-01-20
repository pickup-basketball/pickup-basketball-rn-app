import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// 네비게이션에서 사용할 스크린들의 타입 정의
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Signup: undefined;
};

// navigation 타입 정의
type NavigationProp = StackNavigationProp<RootStackParamList>;

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>PICKUP</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.headerButton}>메인으로</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 폼 */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>
          PICKUP과 함께 새로운 농구 친구를 만나보세요.
        </Text>

        {/* 입력 필드들 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="8자리 이상 입력해주세요"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>

        {/* 가입하기 버튼 */}
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>가입하기</Text>
        </TouchableOpacity>

        {/* 이미 계정이 있나요? */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>로그인하기</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
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
  },
  signupButton: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#ff6b00",
    marginLeft: 8,
  },
});

export default SignupScreen;
