import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/auth/SignupScreen";

type TNavigationProp = StackNavigationProp<RootStackParamList>;

const LoggedInHeader = () => {
  const navigation = useNavigation<TNavigationProp>();
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>PICKUP</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Guide")}>
        <Text style={styles.menuLinkText}>가이드</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Matching")}>
        <Text style={styles.menuLinkText}>매칭</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Courts")}>
        <Text style={styles.menuLinkText}>코트</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoggedInHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  menuLinkText: {
    color: "white",
    fontSize: 16,
  },
});
