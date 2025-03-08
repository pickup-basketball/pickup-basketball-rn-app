// components/match/ParticipationRequestModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { colors } from "../../styles/colors";
import { X, ChevronRight } from "lucide-react-native";
import { ParticipationDetail } from "../../types/participation";
import axiosInstance from "../../api/axios-interceptor";

type ParticipationRequestModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onApprove: (participationDetail: ParticipationDetail) => void;
  onReject: (participationDetail: ParticipationDetail) => void;
  participations: ParticipationDetail[];
};

const ParticipationRequestModal = ({
  isVisible,
  onClose,
  onApprove,
  onReject,
  participations,
}: ParticipationRequestModalProps) => {
  const [selectedParticipation, setSelectedParticipation] =
    useState<ParticipationDetail | null>(null);

  const handleParticipantSelect = (participation: ParticipationDetail) => {
    setSelectedParticipation(participation);
  };

  const handleBack = () => {
    setSelectedParticipation(null);
  };

  const sendNotification = async (title: string, body: string) => {
    try {
      const response = await axiosInstance.post("/notification/all", {
        title,
        body,
      });
      console.log("알림 전송 성공:", response.data);
    } catch (error) {
      console.error("알림 전송 실패:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedParticipation ? "참가 신청 관리" : "참가 신청자 목록"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={colors.grey.light} size={24} />
            </TouchableOpacity>
          </View>

          {!selectedParticipation ? (
            // 참가자 목록 화면
            <>
              <ScrollView style={styles.participantsList}>
                {participations.map((participation, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.participantItem}
                    onPress={() => handleParticipantSelect(participation)}
                  >
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>
                        {participation.member.nickname}
                      </Text>
                      <Text style={styles.participantLevel}>
                        {{
                          BEGINNER: "초급",
                          INTERMEDIATE: "중급",
                          ADVANCED: "고급",
                        }[participation.member.level] || "알 수 없음"}
                      </Text>
                    </View>
                    <View style={styles.participantStatus}>
                      <Text style={styles.statusText}>
                        {{
                          PENDING: "대기 중",
                          ACCEPTED: "수락",
                          REJECTED: "거절",
                        }[participation.participation.status] || "알 수 없음"}
                      </Text>
                      <ChevronRight size={20} color={colors.grey.light} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => {
                  // 입력 받는 다이얼로그 표시 또는 직접 알림 전송
                  sendNotification(
                    "매치 안내",
                    "오늘 매치에 참여해주셔서 감사합니다. 정시에 시작하니 늦지 마세요!"
                  );
                  Alert.alert(
                    "알림 전송",
                    "모든 참가자에게 알림이 전송되었습니다."
                  );
                }}
              >
                <Text style={styles.notificationButtonText}>
                  모든 참가자에게 알림 보내기
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // 선택된 참가자 상세 화면
            <>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← 신청자 목록</Text>
              </TouchableOpacity>

              <View style={styles.participantDetail}>
                <Text style={styles.label}>신청자</Text>
                <Text style={styles.value}>
                  {selectedParticipation.member.nickname}
                </Text>

                <Text style={styles.label}>레벨</Text>
                <Text style={styles.value}>
                  {{
                    BEGINNER: "초급",
                    INTERMEDIATE: "중급",
                    ADVANCED: "고급",
                  }[selectedParticipation.member.level] || "알 수 없음"}
                </Text>

                <Text style={styles.label}>신청 메시지</Text>
                <Text style={styles.message}>
                  {selectedParticipation.participation.message}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => {
                    onReject(selectedParticipation);
                    handleBack();
                  }}
                >
                  <Text style={styles.buttonText}>거절하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => {
                    onApprove(selectedParticipation);
                    handleBack();
                  }}
                >
                  <Text style={styles.buttonText}>수락하기</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.grey.dark,
    borderRadius: 16,
    width: "100%",
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  closeButton: {
    padding: 4,
  },
  participantsList: {
    maxHeight: "100%",
  },
  participantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.medium,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 4,
  },
  participantLevel: {
    fontSize: 14,
    color: colors.grey.light,
  },
  participantStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.primary,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  participantDetail: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.grey.light,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: colors.grey.medium,
  },
  approveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  notificationButton: {
    backgroundColor: colors.grey.medium,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  notificationButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ParticipationRequestModal;
