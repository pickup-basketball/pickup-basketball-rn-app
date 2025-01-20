import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

const MatchingScreen = () => {
  // 매칭 데이터 예시
  const matchings = [
    {
      id: 1,
      time: "오후 3:00",
      location: "강남구 농구장",
      currentMembers: 3,
      maxMembers: 4,
      status: "모집중",
    },
    {
      id: 2,
      time: "오후 4:30",
      location: "서초구 체육관",
      currentMembers: 2,
      maxMembers: 4,
      status: "모집중",
    },
    // 더 많은 매칭 데이터...
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>농구 메이트 찾기</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>메이트 구하기</Text>
        </TouchableOpacity>
      </View>

      {/* 매칭 리스트 */}
      <ScrollView style={styles.content}>
        {matchings.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <Text style={styles.matchTime}>{match.time}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{match.status}</Text>
              </View>
            </View>

            <View style={styles.matchInfo}>
              <Text style={styles.locationText}>{match.location}</Text>
              <View style={styles.memberInfo}>
                <Text style={styles.memberText}>
                  {match.currentMembers}/{match.maxMembers}명
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>참여하기</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  createButton: {
    backgroundColor: "#ff6b00",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  matchCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  matchTime: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "#ff6b00",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
  matchInfo: {
    marginBottom: 15,
  },
  locationText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberText: {
    color: "#999",
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MatchingScreen;
