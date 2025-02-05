import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { ArrowLeft, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../../api/axios-interceptor";
import { WriteScreenNavigationProp } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { GradientWithBox } from "../../components/common/Gradient";

type Props = {
  navigation: WriteScreenNavigationProp;
};

interface FormData {
  title: string;
  description: string;
  courtName: string;
  location: string;
  date: string;
  time: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxPlayers: number;
  cost: number;
  rules: string[];
}

const LEVEL_DISPLAY = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "상급",
} as const;

const WriteMatchForm = ({ navigation }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    courtName: "",
    location: "",
    date: "",
    time: "",
    level: "BEGINNER",
    maxPlayers: 6,
    cost: 0,
    rules: [""],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const date = selectedDate.toISOString().split("T")[0];
      const time = selectedDate.toTimeString().split(" ")[0];
      setFormData((prev) => ({
        ...prev,
        date,
        time,
      }));
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleAddRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const rulesString = formData.rules
        .filter((rule) => rule.trim() !== "")
        .join(",");

      const payload = {
        title: formData.title,
        description: formData.description,
        courtName: formData.courtName,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        level: formData.level,
        currentPlayers: 1,
        maxPlayers: formData.maxPlayers,
        cost: Number(formData.cost),
        rules: rulesString,
      };

      await axiosInstance.post("/matches", payload);
      navigation.navigate("MatchingMain");
    } catch (error) {
      console.error("Error creating match:", error);
      setErrors({ submit: "매치 생성 중 오류가 발생했습니다." });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("MatchingMain")}
          >
            <ArrowLeft color={colors.grey.light} size={24} />
            <Text style={styles.backButtonText}>매치 목록</Text>
          </TouchableOpacity>
          <Text style={styles.title}>새로운 매치 만들기</Text>
          <Text style={styles.subtitle}>
            새로운 농구 매치를 만들어 함께할 플레이어를 모집해보세요!
          </Text>
        </View>

        {/* 제목 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
            placeholder="매력적인 제목을 입력해주세요"
            placeholderTextColor="#666"
          />
        </View>

        {/* 코트 정보 */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>코트 이름</Text>
            <TextInput
              style={styles.input}
              value={formData.courtName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, courtName: text }))
              }
              placeholder="예) 올림픽공원 농구장"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>위치</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              placeholder="예) 서울 송파구 방이동"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* 날짜/시간 선택 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>날짜 및 시간</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formData.date
                ? `${formData.date} ${formData.time}`
                : "날짜와 시간을 선택하세요"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="datetime"
              // is24Hour={true}
              display="default"
              onChange={handleDateTimeChange}
            />
          )}
        </View>

        {/* 레벨 선택 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>레벨</Text>
          <View style={[styles.pickerContainer, { height: 50 }]}>
            <Picker
              selectedValue={formData.level}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, level: value }))
              }
              style={[styles.picker, { height: 50 }]}
            >
              <Picker.Item label="초급" value="BEGINNER" />
              <Picker.Item label="중급" value="INTERMEDIATE" />
              <Picker.Item label="상급" value="ADVANCED" />
            </Picker>
          </View>
        </View>

        {/* 인원/참가비 */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>최대 인원</Text>
            <TextInput
              style={styles.input}
              value={String(formData.maxPlayers)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  maxPlayers: parseInt(text) || 6,
                }))
              }
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>참가비</Text>
            <TextInput
              style={styles.input}
              value={String(formData.cost)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  cost: parseInt(text) || 0,
                }))
              }
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* 설명 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>매치 설명</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            placeholder="매치에 대한 상세한 설명을 입력해주세요"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 규칙 */}
        <View style={styles.inputContainer}>
          <View style={styles.ruleHeader}>
            <Text style={styles.label}>주의사항 (규칙)</Text>
            <TouchableOpacity onPress={handleAddRule}>
              <Text style={styles.addRuleButton}>+ 규칙 추가</Text>
            </TouchableOpacity>
          </View>
          {formData.rules.map((rule, index) => (
            <View key={index} style={styles.ruleContainer}>
              <TextInput
                style={[styles.input, styles.ruleInput]}
                value={rule}
                onChangeText={(text) => {
                  const newRules = [...formData.rules];
                  newRules[index] = text;
                  setFormData((prev) => ({ ...prev, rules: newRules }));
                }}
                placeholder="예) 정시 출발, 체육관 규칙 준수 등"
                placeholderTextColor="#666"
              />
              {index > 0 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveRule(index)}
                >
                  <X color="#FFF" size={20} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity onPress={handleSubmit}>
          <GradientWithBox
            text="매치 생성하기"
            style={{ justifyContent: "center" }}
          />
        </TouchableOpacity>

        {/* 에러 메시지 */}
        {errors.submit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.submit}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
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
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInput: {
    width: "48%",
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
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "rgba(39, 39, 42, 0.5)",
    borderWidth: 1,
    borderColor: "#3F3F46",
    borderRadius: 12,
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    color: "#FFFFFF",
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
  submitButton: {
    backgroundColor: "#F97316",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default WriteMatchForm;
