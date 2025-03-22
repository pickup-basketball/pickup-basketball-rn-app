import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { TNavigationProp } from "../../types/navigation";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>PICKUP</Text>
      <TouchableOpacity
        onPress={() => router.push("start")}
        style={styles.mainButton}
      >
        <View style={styles.buttonContent}>
          <ArrowLeft size={20} color="#fff" />
          <Text style={styles.mainButtonText}>메인으로</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  mainButton: {
    padding: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
});

export default Header;
