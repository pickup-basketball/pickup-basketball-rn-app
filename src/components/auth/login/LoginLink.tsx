import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";

const LoginLink = () => {
  const router = useRouter();

  return (
    <View style={styles.loginLinkContainer}>
      <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
      <TouchableOpacity onPress={() => router.push("login")}>
        <Text style={styles.loginLink}>로그인하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginLink;

const styles = StyleSheet.create({
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
});
