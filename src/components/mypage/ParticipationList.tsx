// components/match/ParticipationList.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash2,
  Edit2,
} from "lucide-react-native";
import { colors } from "../../styles/colors";
import ParticipationRequestModal from "./ParticipationRequestModal";
import { GradientText, GradientWithBox } from "../common/Gradient";
import axiosInstance from "../../api/axios-interceptor";
import axios from "axios";
import {
  ParticipationDetail,
  ParticipationListProps,
} from "../../types/participation";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { Level, Post } from "../../types/match";
import { MatchDetailModal } from "../match/MatchDetailModal";

const ParticipationList = ({
  participations,
  onUpdate,
}: ParticipationListProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [selectedMatchParticipations, setSelectedMatchParticipations] =
    useState<ParticipationDetail[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localParticipations, setLocalParticipations] =
    useState(participations);
  const [selectedMatch, setSelectedMatch] = useState<Post | null>(null);

  useEffect(() => {
    setLocalParticipations(participations);
  }, [participations]);

  const handleEditMatch = (matchData: any) => {
    navigation.navigate("EditMatch", {
      matchData,
      onUpdate,
    });
  };

  console.log("participations", JSON.stringify(participations, null, 2));

  const handleOpenModal = (participations: ParticipationDetail[]) => {
    setSelectedMatchParticipations(participations);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMatchParticipations([]);
  };

  const handleParticipationStatus = async (
    participationDetail: ParticipationDetail,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    const requestBody = {
      participationId: participationDetail.participation.id,
      status,
    };

    console.log("requestBody", JSON.stringify(requestBody, null, 2));

    try {
      const response = await axiosInstance.post("/matches/status", requestBody);

      console.log("handleStatus:", JSON.stringify(response, null, 2));

      if (response.status === 200) {
        Alert.alert(
          "성공",
          `참가 신청이 ${status === "ACCEPTED" ? "수락" : "거절"}되었습니다`
        );
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
          `참가 신청 ${
            status === "ACCEPTED" ? "수락" : "거절"
          } 중 오류가 발생했습니다`;
        Alert.alert("오류", errorMessage);
      }
    }
  };

  const handleApprove = (participationDetail: ParticipationDetail) =>
    handleParticipationStatus(participationDetail, "ACCEPTED");

  const handleReject = (participationDetail: ParticipationDetail) =>
    handleParticipationStatus(participationDetail, "REJECTED");

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
              if (response.status === 200 || response.status === 204) {
                // 서버 요청 성공 시 로컬 상태 업데이트
                setLocalParticipations((prev) =>
                  prev.filter((item) => item.match.id !== matchId)
                );
                Alert.alert("성공", "매치가 삭제되었습니다");
                // 부모 컴포넌트에 변경 알림
                onUpdate?.();
              }
            } catch (error) {
              // 실패 시 원상 복구 로직 추가 가능
              setLocalParticipations(participations);
              Alert.alert("오류", "매치 삭제 중 오류가 발생했습니다");
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "매치 삭제 중 오류가 발생했습니다");
    }
  };
  const renderActionButtons = (item: any) => (
    <View style={styles.buttonRow}>
      <View style={styles.mainButtonContainer}>
        {item.participations.length > 0 ? (
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
        ) : (
          <View style={styles.disabledButton}>
            <View style={styles.buttonContent}>
              <Users
                color={colors.grey.light}
                size={20}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.disabledButtonText}>참가를 기다려주세요</Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditMatch(item.match)}
      >
        <Edit2 color={colors.primary} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.match.id)}
      >
        <Trash2 color={colors.error} size={24} />
      </TouchableOpacity>
    </View>
  );

  const convertMatchToPost = (match: any): Post => {
    return {
      ...match,
      district: match.district || "",
      locationDetail: match.locationDetail || "",
      level: match.level as Level,
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>매치 현황</Text>
      <Text style={styles.sectionSubtitle}>나의 매치를 확인하세요.</Text>
      <View style={styles.listContainer}>
        {participations.length ? (
          participations.map((item) => (
            <View key={item.match.id} style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => setSelectedMatch(convertMatchToPost(item.match))}
              >
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
                        {item.match.district} · {item.match.courtName}
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

                  <View style={styles.participationSection}>
                    {item.participations.length > 0 && (
                      <Text style={styles.participationCount}>
                        참여 신청 {item.participations.length}건
                      </Text>
                    )}
                    {renderActionButtons(item)}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>참여한 매치가 없습니다.</Text>
        )}
      </View>
      {selectedMatch ? (
        <MatchDetailModal
          match={selectedMatch}
          isOpen={true}
          onClose={() => setSelectedMatch(null)}
        />
      ) : null}
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
  editButton: {
    padding: 10,
    backgroundColor: colors.grey.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});

export default ParticipationList;
