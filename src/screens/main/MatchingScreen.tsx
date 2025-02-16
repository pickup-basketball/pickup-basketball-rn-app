// screens/match/index.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Plus, MapPin, Clock, Users, Calendar } from "lucide-react-native";
import { FilterSection } from "../../components/common/FilterSection";
import {
  GradientText,
  GradientWithBox,
} from "../../components/common/Gradient";
import { Post, Level } from "../../types/match";
import { colors } from "../../styles/colors";
import LoggedInHeader from "../../components/common/LoggedInHeader";
import { MatchDetailModal } from "../../components/match/MatchDetailModal";
import { useNavigation } from "@react-navigation/native";
import { WriteScreenNavigationProp } from "../../types/navigation";
import { formatLevel, getLevelStyle } from "../../utils/formatters";
import axiosInstance from "../../api/axios-interceptor";
import ParticipationModal from "../../components/match/ParticipationModal";
import { useMatchJoin } from "../../utils/hooks/useMatchJoin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MatchingScreen = () => {
  const navigation = useNavigation<WriteScreenNavigationProp>();
  const [matches, setMatches] = useState<Post[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Post | null>(null);
  const [locationFilter, setLocationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const {
    isJoinModalVisible,
    selectedMatchForJoin,
    handleJoin,
    handleCloseJoinModal,
  } = useMatchJoin();

  console.log("matches", JSON.stringify(matches, null, 2));

  const fetchMatches = async () => {
    try {
      const response = await axiosInstance.get("/matches");
      if (
        response.data?.matchResponses &&
        Array.isArray(response.data.matchResponses)
      ) {
        setMatches(response.data.matchResponses);
      } else {
        setMatches([]);
      }
    } catch (error) {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Raw userId from AsyncStorage:", userId);
        setCurrentUserId(userId ? Number(userId) : null);
        console.log("Converted currentUserId:", userId ? Number(userId) : null);
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    };
    getCurrentUserId();
  }, []);

  const getFilteredMatches = () => {
    return matches.filter((match) => {
      if (locationFilter !== "all" && match.location !== locationFilter) {
        return false;
      }
      if (levelFilter !== "all" && match.level !== levelFilter) {
        return false;
      }
      return true;
    });
  };

  const renderMatchItem = ({ item }: { item: Post }) => {
    console.log(
      "Comparing currentUserId:",
      currentUserId,
      "with hostId:",
      item.hostId
    );

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => setSelectedMatch(item)}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchTitle}>{item.title}</Text>
          <View style={styles.levelBadge}>
            <Text
              style={[styles.levelText, { color: getLevelStyle(item.level) }]}
            >
              {formatLevel(item.level)}
            </Text>
          </View>
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.infoText}>{item.date}</Text>
            <Clock size={16} color={colors.primary} />
            <Text style={styles.infoText}>{item.time}</Text>
            <Users size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {item.currentPlayers}/{item.maxPlayers}명
            </Text>
          </View>
        </View>

        <View style={styles.matchFooter}>
          <Text style={styles.costText}>
            {item.cost === 0 ? "무료" : `${item.cost.toLocaleString()}원`}
          </Text>
          {currentUserId === item.hostId ? (
            <View style={styles.myMatchBadge}>
              <Text style={styles.myMatchText}>나의 매칭</Text>
            </View>
          ) : item.status === "OPEN" ? (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => {
                handleJoin(item);
              }}
            >
              <GradientWithBox
                text="참여하기"
                style={{
                  alignSelf: "flex-end",
                  width: "100%",
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                }}
              />
            </TouchableOpacity>
          ) : (
            // 마감된 경우
            <View style={styles.closedButton}>
              <Text style={styles.closedButtonText}>마감</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
      <View style={styles.header}>
        <GradientText
          text="농구 메이트 찾기"
          style={styles.headerTitle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Text style={styles.headerDescription}>근처의 매칭을 찾아보세요.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("WriteMatch")}>
          <GradientWithBox
            icon={
              <Plus color={colors.white} size={20} style={{ marginRight: 5 }} />
            }
            text="새로운 매칭 만들기"
            style={{ justifyContent: "center" }}
          />
        </TouchableOpacity>
      </View>
      <FilterSection
        locationFilter={locationFilter}
        levelFilter={levelFilter}
        setLocationFilter={setLocationFilter}
        setLevelFilter={setLevelFilter}
        matches={matches}
      />
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : Array.isArray(matches) && matches.length > 0 ? (
          getFilteredMatches().map((match) => (
            <View key={match.id}>{renderMatchItem({ item: match })}</View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>매치가 없습니다.</Text>
          </View>
        )}
      </ScrollView>
      {selectedMatch ? (
        <MatchDetailModal
          match={selectedMatch}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
        />
      ) : null}
      {selectedMatchForJoin && (
        <ParticipationModal
          isVisible={isJoinModalVisible}
          onClose={handleCloseJoinModal}
          matchId={selectedMatchForJoin.id}
          onParticipate={fetchMatches}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  headerDescription: {
    color: colors.white,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  matchCard: {
    backgroundColor: colors.grey.dark,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: colors.grey.medium,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  matchInfo: {
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  locationText: {
    color: colors.white,
    marginLeft: 10,
  },
  infoText: {
    color: colors.white,
    marginLeft: 10,
    marginRight: 10,
  },
  matchFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  costText: {
    color: colors.white,
  },
  joinButton: {
    justifyContent: "flex-end",
  },
  closedButton: {
    backgroundColor: colors.grey.dark,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closedButtonText: {
    color: colors.grey.medium,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: colors.grey.medium,
    fontSize: 16,
  },
  myMatchBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    opacity: 0.8,
  },
  myMatchText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
