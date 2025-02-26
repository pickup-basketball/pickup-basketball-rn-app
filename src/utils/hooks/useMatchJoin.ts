import { useState } from "react";
import { Post } from "../../types/match";
import axiosInstance from "../../api/axios-interceptor";
import { Alert } from "react-native";

export const useMatchJoin = () => {
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState<Post | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleJoin = (match: Post) => {
    console.log("handleJoin called with match:", match); // 로그 추가
    setSelectedMatchForJoin(match);
    setIsJoinModalVisible(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalVisible(false);
    setSelectedMatchForJoin(null);
    setMessage(""); // 모달 닫을 때 메시지도 초기화
  };

  const submitJoinRequest = async () => {
    console.log("submitJoinRequest called with:", {
      selectedMatchForJoin,
      message,
    });

    if (!selectedMatchForJoin) {
      console.log("No match selected");
      return;
    }

    try {
      console.log("Sending request with:", {
        matchingId: selectedMatchForJoin.id,
        status: "PENDING",
        message: message.trim(),
      });

      const response = await axiosInstance.post("/matches/participation", {
        matchingId: selectedMatchForJoin.id,
        status: "PENDING",
        message: message.trim(),
      });

      console.log("Response:", response);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("성공", "참가 신청이 완료되었습니다.");
        handleCloseJoinModal();
        return true;
      }
    } catch (error) {
      console.error("Error details:", error);
      Alert.alert("오류", "참가 신청 중 오류가 발생했습니다.");
      return false;
    }
  };

  return {
    isJoinModalVisible,
    selectedMatchForJoin,
    message,
    setMessage,
    handleJoin,
    handleCloseJoinModal,
    submitJoinRequest,
  };
};
