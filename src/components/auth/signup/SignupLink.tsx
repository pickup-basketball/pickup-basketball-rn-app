import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const SignupLink = () => {
  const router = useRouter();
  return (
    <View style={styles.signupContainer}>
      <Text style={styles.signupText}>아직 계정이 없으신가요?</Text>
      <TouchableOpacity onPress={() => router.push("signup")}>
        <Text style={styles.signupLink}>회원가입하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupLink;

const styles = StyleSheet.create({
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupLink: {
    color: "#ff6b00",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
