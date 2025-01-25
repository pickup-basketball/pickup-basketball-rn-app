import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Signup: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SignupLink = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.signupContainer}>
      <Text style={styles.signupText}>아직 계정이 없으신가요?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
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
