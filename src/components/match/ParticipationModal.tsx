// components/match/ParticipationModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { X } from "lucide-react-native";
import { colors } from "../../styles/colors";
import { GradientWithBox } from "../common/Gradient";
import axiosInstance from "../../api/axios-interceptor";
import { useMatchJoin } from "../../utils/hooks/useMatchJoin";
import axios from "axios";

type ParticipationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  matchId: number;
  onParticipate?: () => void;
};

const ParticipationModal = ({
  isVisible,
  onClose,
  matchId,
  onParticipate,
}: ParticipationModalProps) => {
  const { message, setMessage } = useMatchJoin();

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    try {
      const response = await axiosInstance.post("/matches/participation", {
        matchingId: matchId,
        status: "PENDING",
        message: message.trim(),
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("성공", "참가 신청이 완료되었습니다.");
        if (onParticipate) {
          onParticipate();
        }
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data,
        });

        if (error.response?.status === 409) {
          Alert.alert(
            "알림",
            error.response?.data?.message || "이미 참가 신청한 매치입니다."
          );
        } else {
          Alert.alert("오류", "참가 신청 중 오류가 발생했습니다.");
        }
      }
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>매치 참여하기</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={colors.grey.light} size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>참여 메시지</Text>
          <TextInput
            style={styles.input}
            placeholder="호스트에게 전달할 메시지를 입력하세요"
            placeholderTextColor={colors.grey.light}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity onPress={handleSubmit}>
            <GradientWithBox text="참여 신청하기" style={{ marginTop: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: colors.grey.dark,
    width: "100%",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    height: 100,
    textAlignVertical: "top",
  },
});

export default ParticipationModal;
