import React from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";

import { levelsWithLabel } from "../../../types/signup";
import { ErrorMessage, RequiredLabel } from "../../common/form/FormElements";
import { colors } from "../../../styles/colors";

type LevelSelectorProps = {
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  onLevelSelect: (level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => void;
  error?: string;
  showModal: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
};

export const LevelSelector = ({
  level,
  onLevelSelect,
  error,
  showModal,
  onModalOpen,
  onModalClose,
}: LevelSelectorProps) => (
  <View style={styles.inputContainer}>
    <RequiredLabel text="레벨" />
    <TouchableOpacity
      style={[styles.input, styles.levelInput, error && styles.inputError]}
      onPress={onModalOpen}
    >
      <Text style={{ color: level ? "#FFFFFF" : "#666" }}>
        {level
          ? levelsWithLabel.find((l) => l.value === level)?.label
          : "레벨을 선택해주세요"}
      </Text>
    </TouchableOpacity>
    {error && <ErrorMessage error={error} />}

    <Modal visible={showModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>레벨 선택</Text>
          {levelsWithLabel.map((levelOption) => (
            <TouchableOpacity
              key={levelOption.value}
              style={styles.modalItem}
              onPress={() => {
                onLevelSelect(levelOption.value);
                onModalClose();
              }}
            >
              <Text style={styles.modalItemText}>{levelOption.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={onModalClose}
          >
            <Text style={styles.modalCloseButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A1A1AA",
  },
  inputContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(39, 39, 42, 0.5)",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    height: 56,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  dateTimeInput: {
    justifyContent: "center",
  },
  levelInput: {
    justifyContent: "center",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  ruleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addRuleButton: {
    color: "#F97316",
    fontSize: 14,
  },
  ruleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ruleInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#3F3F46",
    borderRadius: 8,
  },
  submitButtonContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.5)",
    borderRadius: 12,
  },
  errorText: {
    color: "#EF4444",
  },
  dateTimeText: {
    color: "#FFFFFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.grey.light,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.grey.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: colors.white,
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
  // 새로 추가된 스타일
  fieldError: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requiredMark: {
    color: "#EF4444",
    marginLeft: 4,
    fontSize: 16,
  },
});
