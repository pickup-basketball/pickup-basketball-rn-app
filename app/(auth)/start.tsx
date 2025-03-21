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
import {
  Design1,
  Design2,
  Design3,
  Design4,
} from "../../src/components/landing/LandingElement";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const StartScreen = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const PageContent = ({ index }: { index: number }) => (
    <View style={[styles.page, { width }]}>
      <View style={styles.ContentContainer}>
        {index === 0 && <Design1 />}
        {index === 1 && <Design2 />}
        {index === 2 && <Design3 />}
        {index === 3 && <Design4 />}
      </View>

      <View style={styles.bottomContentContainer}>
        <View style={styles.advancedContainer}>
          <Text style={styles.advancedText}>
            {index === 0 && "프로필 만들기"}
            {index === 1 && "메이트 찾기"}
            {index === 2 && "매치 만들기"}
            {index === 3 && "코트 찾기"}
          </Text>
          <View style={styles.badgeContainer}>
            {[0, 1, 2, 3].map((dotIndex) => (
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
        {[0, 1, 2, 3].map((index) => (
          <PageContent key={index} index={index} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push("/login")}
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
    fontSize: 20,
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
