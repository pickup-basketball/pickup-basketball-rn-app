// components/match/ParticipationList.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar, Clock, MapPin, Users } from "lucide-react-native";
import { colors } from "../../styles/colors";

type Match = {
  id: number;
  title: string;
  courtName: string;
  location: string;
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  status: string;
};

type ParticipationDetail = {
  member: {
    nickname: string;
    level: string;
  };
  participation: {
    status: string;
    message: string;
  };
};

type Participation = {
  match: Match;
  participations: ParticipationDetail[];
};

type ParticipationListProps = {
  participations: Participation[];
};

const ParticipationList = ({ participations }: ParticipationListProps) => {
  const renderItem = ({ item }: { item: Participation }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.match.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.match.status}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconTextContainer}>
          <MapPin size={16} color={colors.grey.light} />
          <Text style={styles.infoText}>
            {item.match.courtName} · {item.match.location}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconTextContainer}>
          <Calendar size={16} color={colors.grey.light} />
          <Text style={styles.infoText}>{item.match.date}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Clock size={16} color={colors.grey.light} />
          <Text style={styles.infoText}>{item.match.time}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Users size={16} color={colors.grey.light} />
          <Text style={styles.infoText}>
            {item.match.currentPlayers}/{item.match.maxPlayers}명
          </Text>
        </View>
      </View>

      {item.participations.length > 0 && (
        <View style={styles.participationInfo}>
          <Text style={styles.messageLabel}>참여 메시지</Text>
          <Text style={styles.message}>
            {item.participations[0].participation.message}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.participationStatus}>
              상태: {item.participations[0].participation.status}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>참여 매치</Text>
      <FlatList
        data={participations}
        renderItem={renderItem}
        keyExtractor={(item) => item.match.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.grey.dark,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    color: colors.grey.light,
    fontSize: 14,
  },
  participationInfo: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey.medium,
  },
  messageLabel: {
    color: colors.grey.light,
    fontSize: 12,
    marginBottom: 4,
  },
  message: {
    color: colors.white,
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 8,
  },
  participationStatus: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ParticipationList;
