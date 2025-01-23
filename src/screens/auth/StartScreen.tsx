import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { UserPlus } from "lucide-react-native";

type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Home: undefined;
  Signup: undefined;
};

type TNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const StartScreen = () => {
  const navigation = useNavigation<TNavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };
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

  const PageContent = ({ index }: { index: number }) => (
    <View style={[styles.page, { width }]}>
      <View style={styles.ContentContainer}>{index === 0 && <Design1 />}</View>

      <View style={styles.bottomContentContainer}>
        <View style={styles.advancedContainer}>
          <Text style={styles.advancedText}>프로필 만들기</Text>
          <View style={styles.badgeContainer}>
            {[0, 1, 2, 3, 4].map((dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.badge,
                  currentPage === dotIndex && styles.currentBadge,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <PageContent key={index} index={index} />
        ))}
      </ScrollView>

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
    backgroundColor: "#ffffff",
  },
  page: {
    flex: 1,
  },
  ContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e9e9",
  },
  bottomContentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  userTypeList: {
    flexDirection: "column",
    marginTop: 20,
  },
  userType: {
    color: "#262626",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  selectedUserType: {
    color: "#FF8800",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  advancedContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  advancedText: {
    color: "#FF8800",
    fontSize: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d1d1",
  },
  currentBadge: {
    backgroundColor: "#FF8800",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: "100%",
  },
  startButton: {
    backgroundColor: "#FF8800",
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
