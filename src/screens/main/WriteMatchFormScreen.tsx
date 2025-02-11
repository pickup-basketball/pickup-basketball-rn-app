import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { ArrowLeft, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "../../api/axios-interceptor";
import { WriteScreenNavigationProp } from "../../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { GradientWithBox } from "../../components/common/Gradient";
import { validateForm } from "../../utils/validators/matchValidator";
import { TFormData } from "../../utils/validators/types";
import { levelsWithLabel, TLevel } from "../../types/signup";

type Props = {
  navigation: WriteScreenNavigationProp;
};

const WriteMatchForm = ({ navigation }: Props) => {
  const [formData, setFormData] = useState<TFormData>({
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

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string>("");

  const handleSelectLevel = (level: TLevel) => {
    setFormData((prev) => ({
      ...prev,
      level,
    }));
    setShowLevelModal(false);
  };

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
      const { isValid, errors: validationErrors } = validateForm(formData);

      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      const rulesString = formData.rules
        .filter((rule) => rule.trim() !== "")
        .join(",");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        courtName: formData.courtName.trim(),
        location: formData.location.trim(),
        date: formData.date,
        time: formData.time,
        level: formData.level,
        currentPlayers: 1,
        maxPlayers: formData.maxPlayers,
        cost: Number(formData.cost),
        rules: rulesString,
      };

      const response = await axiosInstance.post("/matches", payload);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("성공", "매치가 성공적으로 생성되었습니다", [
          { text: "확인", onPress: () => navigation.navigate("MatchingMain") },
        ]);
      }
    } catch (error) {
      console.error("Error creating match:", error);

      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }

      let errorMessage = "매치 생성 중 오류가 발생했습니다";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as ApiError;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }

      setErrors({ submit: errorMessage });
      Alert.alert("오류", errorMessage);
    } finally {
      setIsLoading(false);
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === "title" && styles.inputFocused,
            ]}
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
            placeholder="매력적인 제목을 입력해주세요"
            placeholderTextColor="#666"
            onFocus={() => setFocusedInput("title")}
            onBlur={() => setFocusedInput("")}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>코트 이름</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "courtName" && styles.inputFocused,
              ]}
              value={formData.courtName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, courtName: text }))
              }
              placeholder="예) 올림픽공원 농구장"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("courtName")}
              onBlur={() => setFocusedInput("")}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>위치</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "location" && styles.inputFocused,
              ]}
              value={formData.location}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, location: text }))
              }
              placeholder="예) 서울 송파구 방이동"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("location")}
              onBlur={() => setFocusedInput("")}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>날짜 및 시간</Text>
          <TouchableOpacity
            style={[styles.input, styles.dateTimeInput]}
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
              display="default"
              onChange={handleDateTimeChange}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>레벨</Text>
          <TouchableOpacity
            style={[styles.input, styles.levelInput]}
            onPress={() => setShowLevelModal(true)}
          >
            <Text style={{ color: formData.level ? "#FFFFFF" : "#666" }}>
              {formData.level
                ? levelsWithLabel.find((l) => l.value === formData.level)?.label
                : "레벨을 선택해주세요"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showLevelModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>레벨 선택</Text>
              {levelsWithLabel.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={styles.modalItem}
                  onPress={() => handleSelectLevel(level.value)}
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

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>최대 인원</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "maxPlayers" && styles.inputFocused,
              ]}
              value={String(formData.maxPlayers)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  maxPlayers: parseInt(text) || 6,
                }))
              }
              keyboardType="numeric"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("maxPlayers")}
              onBlur={() => setFocusedInput("")}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>참가비</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "cost" && styles.inputFocused,
              ]}
              value={String(formData.cost)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  cost: parseInt(text) || 0,
                }))
              }
              keyboardType="numeric"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("cost")}
              onBlur={() => setFocusedInput("")}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>매치 설명</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              focusedInput === "description" && styles.inputFocused,
            ]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            placeholder="매치에 대한 상세한 설명을 입력해주세요"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            onFocus={() => setFocusedInput("description")}
            onBlur={() => setFocusedInput("")}
          />
        </View>

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
                style={[
                  styles.input,
                  styles.ruleInput,
                  focusedInput === `rule_${index}` && styles.inputFocused,
                ]}
                value={rule}
                onChangeText={(text) => {
                  const newRules = [...formData.rules];
                  newRules[index] = text;
                  setFormData((prev) => ({ ...prev, rules: newRules }));
                }}
                placeholder="예) 정시 출발, 체육관 규칙 준수 등"
                placeholderTextColor="#666"
                onFocus={() => setFocusedInput(`rule_${index}`)}
                onBlur={() => setFocusedInput("")}
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

        <TouchableOpacity
          style={styles.submitButtonContainer}
          onPress={handleSubmit}
        >
          <GradientWithBox
            text="매치 생성하기"
            style={{ justifyContent: "center" }}
          />
        </TouchableOpacity>

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
});

export default WriteMatchForm;
