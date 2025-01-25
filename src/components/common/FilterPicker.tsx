import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";

type FilterPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder: string;
};

export const FilterPicker: React.FC<FilterPickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsModalVisible(false);
  };

  const selectedLabel =
    items.find((item) => item.value === selectedValue)?.label || placeholder;

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
              onPress={() => handleSelect("all")}
            >
              <Text style={styles.modalOptionText}>{placeholder}</Text>
            </TouchableOpacity>

            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
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
