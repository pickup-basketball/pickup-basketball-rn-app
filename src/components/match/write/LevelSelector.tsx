import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { colors } from "../../../styles/colors";
import { ErrorMessage, RequiredLabel } from "../../common/form/FormElements";
import { TLevel, levelsWithLabel } from "../../../types/signup";

type LevelSelectorProps = {
  level: TLevel;
  onLevelSelect: (level: TLevel) => void;
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
}: LevelSelectorProps) => {
  const renderLevelItem = ({
    item,
  }: {
    item: (typeof levelsWithLabel)[number];
  }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        onLevelSelect(item.value);
        onModalClose();
      }}
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.inputContainer}>
      <RequiredLabel text="레벨" />
      <TouchableOpacity
        style={[styles.input, styles.levelInput, error && styles.inputError]}
        onPress={onModalOpen}
      >
        <Text style={level ? styles.selectedText : styles.placeholderText}>
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
            <FlatList
              data={levelsWithLabel}
              renderItem={renderLevelItem}
              keyExtractor={(item) => item.value}
            />
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
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 24,
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
  levelInput: {
    justifyContent: "center",
  },
  inputError: {
    borderColor: colors.error,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
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
    color: colors.background,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.background,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: colors.white,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.grey.medium,
    fontSize: 16,
  },
});
