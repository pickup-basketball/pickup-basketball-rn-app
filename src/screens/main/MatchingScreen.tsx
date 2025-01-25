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
import { DUMMY_POSTS } from "../../constants/dummy-data";
import LoggedInHeader from "../../components/common/LoggedInHeader";

export const MatchingScreen = () => {
  const [matches, setMatches] = useState<Post[]>([...DUMMY_POSTS]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const formatLevel = (level: Level) =>
    ({
      BEGINNER: "초급",
      INTERMEDIATE: "중급",
      ADVANCED: "상급",
    }[level]);

  const getLevelStyle = (level: Level) =>
    ({
      BEGINNER: colors.level.beginner,
      INTERMEDIATE: colors.level.intermediate,
      ADVANCED: colors.level.advanced,
    }[level]);

  const renderMatchItem = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.matchCard}>
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
        {item.status === "OPEN" ? (
          <TouchableOpacity style={styles.joinButton}>
            <GradientWithBox
              text="참여하기"
              style={{
                width: "100%",
                padding: 10,
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
        <TouchableOpacity>
          <GradientWithBox
            icon={<Plus color={colors.white} size={20} />}
            text="새로운 매칭 만들기"
          />
        </TouchableOpacity>
      </View>

      <FilterSection />

      <ScrollView style={styles.listContainer}>
        {matches.map((match) => (
          <View key={match.id}>{renderMatchItem({ item: match })}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },
  headerDescription: {
    color: colors.grey.medium,
    fontSize: 16,
    marginBottom: 15,
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
    color: colors.grey.medium,
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
  joinButton: {},
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
});
