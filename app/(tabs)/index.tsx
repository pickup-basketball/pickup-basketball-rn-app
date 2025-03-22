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
import { useNavigation } from "@react-navigation/native";
import { WriteScreenNavigationProp } from "../../src/types/navigation";
import { Level, Post } from "../../src/types/match";
import { useMatchJoin } from "../../src/utils/hooks/useMatchJoin";
import { getCurrentUserId } from "../../src/utils/auth";
import axiosInstance from "../../src/api/axios-interceptor";
import { formatLevel, getLevelStyle } from "../../src/utils/formatters";
import { colors } from "../../src/styles/colors";
import {
  GradientText,
  GradientWithBox,
} from "../../src/components/common/Gradient";
import LoggedInHeader from "../../src/components/common/LoggedInHeader";
import { FilterSection } from "../../src/components/common/FilterSection";
import { MatchDetailModal } from "../../src/components/match/MatchDetailModal";
import ParticipationModal from "../../src/components/match/ParticipationModal";

const MatchingScreen = () => {
  const navigation = useNavigation<WriteScreenNavigationProp>();
  const [selectedMatch, setSelectedMatch] = useState<Post | null>(null);
  const [allMatches, setAllMatches] = useState<Post[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Post[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
    isJoinModalVisible,
    selectedMatchForJoin,
    handleJoin,
    handleCloseJoinModal,
  } = useMatchJoin();

  const loadMoreMatches = async () => {
    if (isLoadingMore || currentPage >= totalPages - 1) return;

    setIsLoadingMore(true);
    await fetchMatches(currentPage + 1, true);
  };

  useEffect(() => {
    const initializeUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };

    initializeUserId();
  }, []);

  const fetchMatches = async (
    page: number = 0,
    isLoadingMore: boolean = false
  ) => {
    try {
      setLoading(!isLoadingMore);
      const response = await axiosInstance.get("/matches", {
        params: {
          page,
          size: 10,
        },
      });

      if (
        response.data?.matchResponses &&
        Array.isArray(response.data.matchResponses)
      ) {
        const newMatches = isLoadingMore
          ? [...allMatches, ...response.data.matchResponses]
          : response.data.matchResponses;

        setAllMatches(newMatches);
        // 필터링 적용
        applyFilters(newMatches);

        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const applyFilters = (matches: Post[]) => {
    let result = [...matches];

    // 지역 필터 적용
    if (locationFilter !== "all") {
      // 서울특별시, 서울시 등을 제거하고 구 이름만으로 비교
      const locationName = locationFilter.replace(/서울특별시\s|서울시\s/, "");
      result = result.filter((match) => {
        const districtName = match.district.replace(
          /서울특별시\s|서울시\s/,
          ""
        );
        return (
          districtName.includes(locationName) ||
          locationName.includes(districtName)
        );
      });
    }

    if (levelFilter !== "all") {
      result = result.filter((match) => match.level === levelFilter);
    }

    setFilteredMatches(result);
  };

  useEffect(() => {
    applyFilters(allMatches);
  }, [locationFilter, levelFilter]);

  useEffect(() => {
    fetchMatches(0);
  }, []);

  const renderMatchItem = ({ item }: { item: Post }) => {
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
            <Text style={styles.locationText}>
              {`${item.courtName} (${item.district})`}
            </Text>
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
        matches={allMatches}
      />
      <ScrollView
        style={styles.listContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20;

          if (isCloseToBottom && !loading && !isLoadingMore) {
            loadMoreMatches();
          }
        }}
        scrollEventThrottle={400}
      >
        {loading && currentPage === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : filteredMatches.length > 0 ? (
          <>
            {filteredMatches.map((match) => (
              <View key={match.id}>{renderMatchItem({ item: match })}</View>
            ))}
            {isLoadingMore && (
              <View style={styles.loadingMoreContainer}>
                <Text style={styles.loadingText}>더 불러오는 중...</Text>
              </View>
            )}
          </>
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
    paddingHorizontal: 20,
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
    marginHorizontal: 10,
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
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    opacity: 0.8,
  },
  myMatchText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default MatchingScreen;
