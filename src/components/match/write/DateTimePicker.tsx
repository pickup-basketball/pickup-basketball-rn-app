import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { colors } from "../../../styles/colors";
import { ErrorMessage, RequiredLabel } from "../../common/form/FormElements";

type DateTimePickerProps = {
  date: string;
  time: string;
  onDateTimeChange: (event: any, selectedDate: Date | undefined) => void;
  error?: string;
  showPicker: boolean;
  onPress: () => void;
};

export const DateTimePickerComponent = ({
  date,
  time,
  onDateTimeChange,
  error,
  showPicker,
  onPress,
}: DateTimePickerProps) => {
  const getDateValue = () => {
    if (date && time) {
      const [year, month, day] = date.split("-").map(Number);
      const [hours, minutes] = time.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return new Date();
  };

  return (
    <View style={styles.inputContainer}>
      <RequiredLabel text="날짜 및 시간" />
      <TouchableOpacity
        style={[styles.input, styles.dateTimeInput, error && styles.inputError]}
        onPress={onPress}
      >
        <Text style={styles.dateTimeText}>
          {date ? `${date} ${time}` : "날짜와 시간을 선택하세요"}
        </Text>
      </TouchableOpacity>
      {error && <ErrorMessage error={error} />}
      {showPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={getDateValue()}
            mode="datetime"
            display="default"
            onChange={onDateTimeChange}
            minimumDate={new Date()}
            style={styles.picker}
          />
        </View>
      )}
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
    color: colors.white,
    fontSize: 16,
    height: 56,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  pickerContainer: {
    marginTop: 8,
  },
  picker: {
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  dateTimeInput: {
    justifyContent: "center",
    borderWidth: 1,
  },
  dateTimeText: {
    color: colors.white,
    fontSize: 16,
  },
});
