import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Wallet,
  Trophy,
  Share2,
  AlertCircle,
  X,
} from "lucide-react-native";
import { colors } from "../../styles/colors";
import { Post } from "../../types/match";
import { formatLevel, getLevelColor } from "../../utils/formatters";
import { GradientWithBox } from "../common/Gradient";
import { useMatchJoin } from "../../utils/hooks/useMatchJoin";
import ParticipationModal from "./ParticipationModal";
import { getCurrentUserId } from "../../utils/auth";

type TMatchDetailModalProps = {
  match: Post;
  isOpen: boolean;
  onClose: () => void;
};

export const MatchDetailModal = ({
  match,
  isOpen,
  onClose,
}: TMatchDetailModalProps) => {
  const {
    isJoinModalVisible,
    selectedMatchForJoin,
    handleJoin,
    handleCloseJoinModal,
  } = useMatchJoin();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const initializeUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };

    initializeUserId();
  }, []);

  const isMyMatch = currentUserId === match.hostId;

  const ProgressBar = ({ current, max }: { current: number; max: number }) => (
    <View style={styles.progressContainer}>
      <View
        style={[styles.progressBar, { width: `${(current / max) * 100}%` }]}
      />
    </View>
  );

  const renderInfoSection = (
    icon: React.ReactNode,
    label: string,
    value: string
  ) => (
    <View style={styles.infoSection}>
      <View style={styles.infoHeader}>
        {icon}
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const rules = match.rules?.split(",") || [];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent={true} // 안드로이드에서 상태바 영역까지 모달 확장
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={colors.white} size={24} />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{match.title}</Text>
                <Text style={styles.courtName}>{match.courtName}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={styles.location}>
                    {`${match.district || ""} ${match.locationDetail || ""}`}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: getLevelColor(match.level) },
                ]}
              >
                <Text style={styles.levelText}>{formatLevel(match.level)}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              {renderInfoSection(
                <Calendar size={16} color={colors.primary} />,
                "날짜",
                match.date
              )}
              {renderInfoSection(
                <Clock size={16} color={colors.primary} />,
                "시간",
                match.time
              )}
            </View>

            <View style={styles.participantsSection}>
              <View style={styles.participantsHeader}>
                <View style={styles.row}>
                  <Users size={16} color={colors.primary} />
                  <Text style={styles.sectionLabel}>참가 현황</Text>
                </View>
                <Text style={styles.participantsCount}>
                  {match.currentPlayers}/{match.maxPlayers}명
                </Text>
              </View>
              <ProgressBar
                current={match.currentPlayers}
                max={match.maxPlayers}
              />
            </View>

            {/* Cost Section */}
            <View style={styles.costSection}>
              <View style={styles.row}>
                <Wallet size={16} color={colors.primary} />
                <Text style={styles.sectionLabel}>참가비</Text>
              </View>
              <Text style={styles.costValue}>
                {match.cost === 0 ? "무료" : `${match.cost.toLocaleString()}원`}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>매치 설명</Text>
              <Text style={styles.description}>
                {match.description || "매치 설명이 없습니다."}
              </Text>
            </View>

            {/* Rules */}
            {rules.length > 0 && (
              <View style={styles.rulesSection}>
                <View style={styles.rulesHeader}>
                  <AlertCircle size={16} color={colors.primary} />
                  <Text style={styles.sectionTitle}>주의사항</Text>
                </View>
                {rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <View style={styles.ruleDot} />
                    <Text style={styles.ruleText}>{rule.trim()}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.actionBar}>
            <View style={styles.hostSection}>
              <View style={styles.hostAvatar}>
                <GradientWithBox
                  icon={<Trophy size={24} color={colors.white} />}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 30,
                  }}
                />
              </View>
              <View>
                <Text style={styles.hostLabel}>주최자</Text>
                <Text style={styles.hostName}>Host #{match.hostId}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={20} color={colors.white} />
              </TouchableOpacity>
              {isMyMatch ? (
                <View style={styles.myMatchBadge}>
                  <Text style={styles.myMatchText}>나의 매칭</Text>
                </View>
              ) : (
                <TouchableOpacity
                  disabled={match.status === "CLOSED"}
                  onPress={() => handleJoin(match)}
                >
                  <GradientWithBox
                    text={match.status === "CLOSED" ? "마감됨" : "참여하기"}
                    style={{
                      width: "100%",
                      opacity: match.status === "CLOSED" ? 0.5 : 1,
                      paddingHorizontal: 30,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      {selectedMatchForJoin && (
        <ParticipationModal
          isVisible={isJoinModalVisible}
          onClose={handleCloseJoinModal}
          matchId={selectedMatchForJoin.id}
          onParticipate={onClose}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: colors.grey.dark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.grey.medium,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
    padding: 2,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: colors.white,
    backgroundColor: colors.grey.dark,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
    flexShrink: 1,
    paddingRight: 16,
  },
  courtName: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    color: colors.grey.light,
    marginLeft: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  infoSection: {
    flex: 1,
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 16,
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    color: colors.grey.light,
    fontSize: 12,
    marginLeft: 8,
  },
  infoValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
  },
  participantsSection: {
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  participantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLabel: {
    color: colors.grey.light,
    marginLeft: 8,
  },
  participantsCount: {
    color: colors.white,
    fontWeight: "500",
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.grey.dark,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  costSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  costValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  descriptionSection: {
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.grey.light,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    color: colors.white,
    lineHeight: 20,
  },
  rulesSection: {
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  rulesHeader: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 7,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ruleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  ruleText: {
    color: colors.white,
    lineHeight: 20,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey.medium,
  },
  hostSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  hostLabel: {
    color: colors.grey.medium,
    fontSize: 12,
  },
  hostName: {
    color: colors.white,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    padding: 8,
    backgroundColor: colors.grey.dark,
    borderRadius: 8,
    marginRight: 12,
  },
  joinButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  joinButtonDisabled: {
    backgroundColor: colors.grey.dark,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
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
});
