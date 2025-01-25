import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginLink = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.loginLinkContainer}>
      <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
