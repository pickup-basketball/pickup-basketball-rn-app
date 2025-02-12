// components/profile/EditProfileModal.tsx
import React, { useEffect, useState } from "react";
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
import {
  positions,
  levelsWithLabel,
  positionMapping,
} from "../../types/signup";

type EditProfileModalProps = {
  isVisible: boolean;
  onClose: () => void;
  currentProfile: any; // 현재 프로필 정보
  onUpdate: () => void; // 프로필 업데이트 후 호출할 함수
};

const EditProfileModal = ({
  isVisible,
  onClose,
  currentProfile,
  onUpdate,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    email: currentProfile?.email || "",
    password: currentProfile?.password || "",
    nickname: currentProfile?.nickname || "",
    height: currentProfile?.height?.toString() || "",
    weight: currentProfile?.weight?.toString() || "",
    position: currentProfile?.position || "C",
    level: currentProfile?.level || "BEGINNER",
  });
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        email: currentProfile.email,
        password: currentProfile.password,
        nickname: currentProfile.nickname,
        height: currentProfile.height.toString(),
        weight: currentProfile.weight.toString(),
        position: currentProfile.position,
        level: currentProfile.level,
      });
    }
  }, [currentProfile]);

  const handleSubmit = async () => {
    try {
      if (!formData.password) {
        Alert.alert("알림", "비밀번호를 입력해주세요");
        return;
      }

      const requestData = {
        email: formData.email,
        password: formData.password, // 백엔드가 빈 문자열을 허용하지 않으므로 항상 포함
        nickname: formData.nickname,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        position: formData.position,
        level: formData.level,
      };

      await axiosInstance.put("/member", requestData);

      Alert.alert("성공", "프로필이 업데이트되었습니다");
      onUpdate();
      onClose();
    } catch (error) {
      Alert.alert("오류", "프로필 업데이트 중 오류가 발생했습니다");
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>프로필 수정</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={colors.grey.light} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                value="" // 빈 값으로 표시
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: text || prev.password, // 새 입력이 있으면 업데이트, 없으면 기존 값 유지
                  }))
                }
                placeholder="비밀번호 (변경하려면 입력)"
                placeholderTextColor={colors.grey.light}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                value={formData.nickname}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, nickname: text }))
                }
                placeholder="닉네임"
                placeholderTextColor={colors.grey.light}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>키</Text>
                <TextInput
                  style={styles.input}
                  value={formData.height}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, height: text }))
                  }
                  placeholder="키 (cm)"
                  placeholderTextColor={colors.grey.light}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>몸무게</Text>
                <TextInput
                  style={styles.input}
                  value={formData.weight}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, weight: text }))
                  }
                  placeholder="몸무게 (kg)"
                  placeholderTextColor={colors.grey.light}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>선호 포지션</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPositionModal(true)}
              >
                <Text
                  style={{
                    color: formData.position ? colors.white : colors.grey.light,
                  }}
                >
                  {formData.position || "포지션을 선택해주세요"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Position Modal */}
            <Modal
              visible={showPositionModal}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.selectionModalContent}>
                  <Text style={styles.modalTitle}>포지션 선택</Text>
                  {positions.map((position) => (
                    <TouchableOpacity
                      key={position}
                      style={styles.modalItem}
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, position }));
                        setShowPositionModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>
                        {positionMapping[position]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowPositionModal(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>닫기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* 레벨 선택 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>레벨</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowLevelModal(true)}
              >
                <Text
                  style={{
                    color: formData.level ? colors.white : colors.grey.light,
                  }}
                >
                  {formData.level
                    ? levelsWithLabel.find((l) => l.value === formData.level)
                        ?.label
                    : "레벨을 선택해주세요"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Level Modal */}
            <Modal
              visible={showLevelModal}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.selectionModalContent}>
                  <Text style={styles.modalTitle}>레벨 선택</Text>
                  {levelsWithLabel.map((level) => (
                    <TouchableOpacity
                      key={level.value}
                      style={styles.modalItem}
                      onPress={() => {
                        setFormData((prev) => ({
                          ...prev,
                          level: level.value,
                        }));
                        setShowLevelModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{level.label}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowLevelModal(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>닫기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <GradientWithBox
                text="프로필 수정하기"
                style={{ justifyContent: "center" }}
              />
            </TouchableOpacity>
          </View>
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
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.grey.dark,
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
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
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    height: 48,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
  selectionModalContent: {
    backgroundColor: colors.grey.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.medium,
    height: 56,
    justifyContent: "center",
  },
  modalItemText: {
    fontSize: 16,
    color: colors.white,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: colors.grey.medium,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileModal;
