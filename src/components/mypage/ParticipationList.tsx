// components/match/ParticipationList.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Calendar, Clock, MapPin, Users } from "lucide-react-native";
import { colors } from "../../styles/colors";
import ParticipationRequestModal from "./ParticipationRequestModal";
import { GradientText, GradientWithBox } from "../common/Gradient";
import axiosInstance from "../../api/axios-interceptor";
import axios from "axios";
import {
  ParticipationDetail,
  ParticipationListProps,
} from "../../types/participation";

const ParticipationList = ({
  participations,
  onUpdate,
}: ParticipationListProps) => {
  const [selectedMatchParticipations, setSelectedMatchParticipations] =
    useState<ParticipationDetail[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = (participations: ParticipationDetail[]) => {
    setSelectedMatchParticipations(participations);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMatchParticipations([]);
  };

  const handleApprove = async (participationDetail: ParticipationDetail) => {
    console.log("Starting Approve with participation:", participationDetail);
    try {
      const response = await axiosInstance.post("/matches/accept", {
        participationId: participationDetail.participation.id,
      });

      if (response.status === 200) {
        Alert.alert("성공", "참가 신청이 수락되었습니다");
        handleCloseModal();
        onUpdate?.();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        const errorMessage =
          error.response?.data?.message ||
          "참가 신청 수락 중 오류가 발생했습니다";
        Alert.alert("오류", errorMessage);
      }
    }
  };
  const handleReject = async (participationDetail: ParticipationDetail) => {
    console.log("Starting reject with participation:", participationDetail);
    try {
      const response = await axiosInstance.post("/matches/rejected", {
        participationId: participationDetail.participation.id,
      });

      if (response.status === 200) {
        Alert.alert("성공", "참가 신청이 거절되었습니다");
        handleCloseModal();
        onUpdate?.(); // 목록 새로고침
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        const errorMessage =
          error.response?.data?.message ||
          "참가 신청 거절 중 오류가 발생했습니다";
        Alert.alert("오류", errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>매치 현황</Text>
      <Text style={styles.sectionSubtitle}>나의 매치를 확인하세요.</Text>
      <View style={styles.listContainer}>
        {participations.length ? (
          participations.map((item) => (
            <View key={item.match.id} style={styles.cardContainer}>
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.title}>{item.match.title}</Text>
                  {/* <View style={styles.statusBadge}> */}
                  {/* <GradientWithBox style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.match.status}</Text>
                  </GradientWithBox> */}
                  <GradientText>
                    <Text style={styles.statusText}>{item.match.status}</Text>
                  </GradientText>
                  {/* </View> */}
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
                  <View style={styles.participationSection}>
                    <Text style={styles.participationCount}>
                      참여 신청 {item.participations.length}건
                    </Text>

                    <TouchableOpacity
                      onPress={() => handleOpenModal(item.participations)}
                    >
                      <GradientWithBox
                        icon={
                          <Users
                            color={colors.white}
                            size={20}
                            style={{ marginRight: 5 }}
                          />
                        }
                        text="참여 관리하러 가기"
                        style={{ justifyContent: "center" }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>참여한 매치가 없습니다.</Text>
        )}
      </View>
      <ParticipationRequestModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
        participations={selectedMatchParticipations}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  sectionSubtitle: {
    color: colors.grey.medium,
    marginTop: 8,
  },
  listContainer: {
    marginTop: 20,
    gap: 10,
  },
  card: {
    backgroundColor: colors.grey.dark,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.grey.medium,
    borderRadius: 12,
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
    width: "20%",
    height: "90%",
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
  participationRequestButton: {},
  messageLabel: {
    borderTopWidth: 1,
    borderTopColor: colors.grey.medium,
    color: colors.white,
    fontSize: 12,
    marginBottom: 4,
    marginTop: 8,
    paddingTop: 12,
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
  participationSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  participationCount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginBottom: 8,
  },
});

export default ParticipationList;
