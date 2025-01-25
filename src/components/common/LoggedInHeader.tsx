import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../screens/auth/SignupScreen";
import { User } from "lucide-react-native";
import { colors } from "../../styles/colors";

type TNavigationProp = StackNavigationProp<RootStackParamList>;

const LoggedInHeader = () => {
  const navigation = useNavigation<TNavigationProp>();
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Guide")}>
          <Text style={styles.logo}>PICKUP</Text>
        </TouchableOpacity>
        <View style={styles.menuButton}>
          <TouchableOpacity onPress={() => navigation.navigate("Matching")}>
            <Text style={styles.menuLinkText}>매칭</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Courts")}>
            <Text style={styles.menuLinkText}>코트</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.userButton}>
          <TouchableOpacity>
            <User color="white" size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoggedInHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "black",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "white",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
  },
  menuLinkText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userButton: {},
});
