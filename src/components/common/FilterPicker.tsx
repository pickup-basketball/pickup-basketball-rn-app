import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { Level } from "../../types/match";

type FilterPickerProps<T extends string | number> = {
  selectedValue: T;
  onValueChange: (value: T) => void;
  items: Array<{ label: string; value: T }>;
};

export const FilterPicker = <T extends string | number>({
  selectedValue,
  onValueChange,
  items,
}: FilterPickerProps<T>) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (value: T) => {
    onValueChange(value);
    setIsModalVisible(false);
  };

  const selectedLabel = items.find(
    (item) => item.value === selectedValue
  )?.label;

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelect(selectedValue)}
            ></TouchableOpacity>

            {items.map((item) => (
              <TouchableOpacity
                key={String(item.value)} // key로 문자열만 허용하므로 타입 캐스팅
                style={styles.modalOption}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.modalOptionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#434343",
    // backgroundColor: "#1F1F1F",
  },
  button: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#27272A",
    borderRadius: 8,
    padding: 15,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#434343",
  },
  modalOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
