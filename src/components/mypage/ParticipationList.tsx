// components/match/ParticipationList.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Calendar, Clock, MapPin, Users, Trash2 } from "lucide-react-native";
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
  const handleDelete = async (matchId: number) => {
    try {
      Alert.alert("매치 삭제", "정말로 이 매치를 삭제하시겠습니까?", [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(
                `/matches/${matchId}`
              );
              if (response.status === 200) {
                Alert.alert("성공", "매치가 삭제되었습니다");
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
                  "매치 삭제 중 오류가 발생했습니다";
                Alert.alert("오류", errorMessage);
              }
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "매치 삭제 중 오류가 발생했습니다");
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
                  <GradientText>
                    <Text style={styles.statusText}>
                      {item.match.status === "OPEN" ? "모집 중" : "마감"}
                    </Text>
                  </GradientText>
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

                {item.participations.length > 0 ? (
                  <View style={styles.participationSection}>
                    <Text style={styles.participationCount}>
                      참여 신청 {item.participations.length}건
                    </Text>
                    <View style={styles.buttonRow}>
                      <View style={styles.mainButtonContainer}>
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
                            text="참여 관리하기"
                            style={{ justifyContent: "center" }}
                          />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.match.id)}
                      >
                        <Trash2 color={colors.error} size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.participationSection}>
                    <View style={styles.buttonRow}>
                      <View style={styles.mainButtonContainer}>
                        <View style={styles.disabledButton}>
                          <View style={styles.buttonContent}>
                            <Users
                              color={colors.grey.light}
                              size={20}
                              style={{ marginRight: 5 }}
                            />
                            <Text style={styles.disabledButtonText}>
                              참가를 기다려주세요
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.match.id)}
                      >
                        <Trash2 color={colors.error} size={24} />
                      </TouchableOpacity>
                    </View>
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
  disabledButton: {
    backgroundColor: colors.grey.dark,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    opacity: 0.7, // 약간 흐리게
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButtonText: {
    color: colors.grey.light,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: colors.grey.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  mainButtonContainer: {
    flex: 1,
  },
});

export default ParticipationList;
