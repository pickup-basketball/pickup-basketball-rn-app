import React, { useEffect, useState } from "react";
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
  onPickerClose: () => void;
};

export const DateTimePickerComponent = ({
  date,
  time,
  onDateTimeChange,
  error,
  showPicker,
  onPress,
  onPickerClose,
}: DateTimePickerProps) => {
  const [mode, setMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const getDateValue = () => {
    // 기존에 선택한 날짜/시간이 있으면 그 값을 사용
    if (date && time) {
      try {
        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes] = time.split(":").map(Number);

        // 유효한 날짜인지 검증
        const selectedDate = new Date(year, month - 1, day, hours, minutes);

        // 유효한 날짜이면 반환
        if (!isNaN(selectedDate.getTime())) {
          console.log("사용자가 선택한 날짜 사용:", selectedDate);
          return selectedDate;
        }
      } catch (error) {
        console.error("날짜 파싱 오류:", error);
      }
    }

    // 날짜가 없거나 파싱에 실패한 경우 현재 날짜 반환
    console.log("현재 날짜 사용:", new Date());
    return new Date();
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        onPickerClose();
        return;
      }

      if (mode === "date" && selectedDate) {
        // 선택한 날짜 임시 저장
        setTempDate(selectedDate);

        // 시간 선택기로 전환
        setMode("time");
        return;
      }

      if (mode === "time" && selectedDate && tempDate) {
        // 저장된 날짜와 새로 선택한 시간 합치기
        const combinedDate = new Date(tempDate);
        combinedDate.setHours(selectedDate.getHours());
        combinedDate.setMinutes(selectedDate.getMinutes());

        // 합쳐진 날짜/시간 전달
        onDateTimeChange(event, combinedDate);
        onPickerClose();
      }
    } else {
      // iOS는 그대로 처리
      if (selectedDate) {
        onDateTimeChange(event, selectedDate);
      }
    }
  };

  useEffect(() => {
    if (!showPicker) {
      // 피커가 닫힐 때 mode를 date로 리셋 다시 눌렀을 경우 date부터 입력 가능
      setMode("date");
    }
  }, [showPicker]);

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
          {Platform.OS === "ios" ? (
            // iOS는 한 번에 날짜와 시간 모두 선택 가능
            <DateTimePicker
              value={getDateValue()}
              mode="datetime"
              display="default"
              onChange={handleChange}
              minimumDate={new Date()}
              style={styles.picker}
            />
          ) : (
            // Android는 별도로 날짜와 시간 선택
            <DateTimePicker
              value={getDateValue()}
              mode={mode}
              display="default"
              onChange={handleChange}
              minimumDate={mode === "date" ? new Date() : undefined}
              style={styles.picker}
            />
          )}
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
