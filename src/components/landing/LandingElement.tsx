import { StyleSheet } from "react-native";
import { UserPlus, Users, MapPin } from "lucide-react-native";
import { Text, View } from "react-native";

const Design1 = () => (
  <>
    <UserPlus color="#FF8800" size={100} />
    <View style={styles.userTypeList}>
      <Text style={styles.userType}>Point Guard [PG]</Text>
      <Text style={styles.userType}>Shooting Guard [SG]</Text>
      <Text style={styles.selectedUserType}>Small Forward [SF]</Text>
      <Text style={styles.userType}>Power Forward [PF]</Text>
      <Text style={styles.userType}>Center [C]</Text>
    </View>
  </>
);

const Design2 = () => (
  <>
    <UserPlus color="#FF8800" size={100} />
    <View style={styles.textContainer}>
      <Text style={styles.mainText}>나에게 딱 맞는 메이트를 찾아보세요</Text>
      <Text style={styles.subText}>
        혼자서 농구하기 지치셨나요? {"\n"}
        PICK UP과 함께 농구를 즐겨보세요!
      </Text>
    </View>
  </>
);

const Design3 = () => (
  <>
    <Users color="#FF8800" size={100} />
    <View style={styles.textContainer}>
      <Text style={styles.mainText}>내 스타일대로 즐기는 농구</Text>
      <Text style={styles.subText}>
        호스트가 되어 팀을 모집하고 {"\n"}
        참가자로 게임에 참여하세요
      </Text>
    </View>
  </>
);

const Design4 = () => (
  <>
    <MapPin color="#FF8800" size={100} />
    <View style={styles.textContainer}>
      <Text style={styles.mainText}>우리 동네 숨은 농구장 발견!</Text>
      <Text style={styles.subText}>
        가까운 농구장을 찾고 {"\n"}
        새로운 플레이어들과 만나보세요
      </Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  userTypeList: {
    flexDirection: "column",
    marginTop: 20,
    gap: 8,
  },
  userType: {
    color: "#262626",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedUserType: {
    color: "#FF8800",
    fontSize: 16,
    fontWeight: "500",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  mainText: {
    fontSize: 22,
    color: "#262626",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 32,
    fontWeight: "600",
  },
  subText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export { Design1, Design2, Design3, Design4 };
