import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Main: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const StartScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* 회원 유형 */}
        <View style={styles.userTypeList}>
          <Text style={styles.userType}>Post Guard [PG]</Text>
          <Text style={styles.userType}>Shooting Guard [SG]</Text>
          <Text style={styles.userType}>Point Forward [PF]</Text>
          <Text style={styles.userType}>Center [C]</Text>
        </View>

        {/* 프로필 아이콘 */}
        <View style={styles.profileIconContainer}>
          <View style={styles.profileIcon}>
            <Image
              // source={require("../../assets/profile-icon.png")}
              style={styles.icon}
            />
          </View>
        </View>

        {/* Advanced 표시 */}
        <View style={styles.advancedContainer}>
          <Text style={styles.advancedText}>Advanced</Text>
          <View style={styles.badge} />
        </View>
      </View>

      {/* 시작하기 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userTypeList: {
    alignItems: "center",
    marginBottom: 30,
  },
  userType: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  profileIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  advancedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  advancedText: {
    color: "#ff6b00",
    fontSize: 16,
    marginRight: 8,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff6b00",
  },
  startButton: {
    backgroundColor: "#ff6b00",
    width: "100%",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StartScreen;
