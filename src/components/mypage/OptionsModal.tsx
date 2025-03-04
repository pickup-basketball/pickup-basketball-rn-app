import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

type TOptionsModal = {
  isVisible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onWithdrawal: () => void;
};

const OptionsModal = ({
  isVisible,
  onClose,
  onEditProfile,
  onLogout,
  onWithdrawal,
}: TOptionsModal) => {
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onEditProfile();
                onClose();
              }}
            >
              <Text style={[styles.optionText, styles.editProfileText]}>
                프로필 수정
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onLogout();
                onClose();
              }}
            >
              <Text style={styles.optionText}>로그아웃</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onWithdrawal();
                onClose();
              }}
            >
              <Text style={[styles.optionText, styles.withdrawalText]}>
                회원 탈퇴
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "70%",
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  optionText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  withdrawalText: {
    color: colors.grey.light,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey.medium,
  },
  editProfileText: {
    color: colors.primary,
  },
});

export default OptionsModal;
