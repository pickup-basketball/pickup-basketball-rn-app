import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { ArrowLeft, X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "../../api/axios-interceptor";
import { colors } from "../../styles/colors";
import { GradientWithBox } from "../common/Gradient";
import { validateForm } from "../../utils/validators/matchValidator";
import { TFormData } from "../../utils/validators/types";
import { levelsWithLabel, TLevel } from "../../types/signup";
import axios from "axios";
import { RouteProp } from "@react-navigation/native";
import { MyPageStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

type EditMatchScreenProps = {
  route: RouteProp<MyPageStackParamList, "EditMatch">;
  navigation: StackNavigationProp<MyPageStackParamList, "EditMatch">;
};

const ErrorMessage = ({ error }: { error: string }) => (
  <Text style={styles.fieldError}>{error}</Text>
);

const RequiredLabel = ({ text }: { text: string }) => (
  <View style={styles.labelContainer}>
    <Text style={styles.label}>{text}</Text>
    <Text style={styles.requiredMark}>*</Text>
  </View>
);

export const EditMatchScreen = ({
  route,
  navigation,
}: EditMatchScreenProps) => {
  const { matchData, onUpdate } = route.params;
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
  };

  const handleSelectLevel = (level: TLevel) => {
    setFormData((prev) => ({
      ...prev,
      level,
    }));
    setShowLevelModal(false);
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

  // 초기 데이터 설정
  useEffect(() => {
    if (matchData) {
      setFormData({
        title: matchData.title,
        description: matchData.description,
        courtName: matchData.courtName,
        location: matchData.location,
        date: matchData.date,
        time: matchData.time,
        level: matchData.level,
        maxPlayers: matchData.maxPlayers,
        cost: matchData.cost,
        rules: matchData.rules.split(","),
      });
    }
  }, [matchData]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string>("");

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
        currentPlayers: matchData.currentPlayers,
        maxPlayers: formData.maxPlayers,
        cost: Number(formData.cost),
        rules: rulesString,
      };

      const response = await axiosInstance.put(
        `/matches/${matchData.id}`,
        payload
      );

      if (response.status === 200) {
        Alert.alert("성공", "매치가 수정되었습니다", [
          {
            text: "확인",
            onPress: () => {
              onUpdate?.();
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        const errorMessage =
          error.response?.data?.message || "매치 수정 중 오류가 발생했습니다";
        Alert.alert("오류", errorMessage);
      }
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
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color={colors.grey.light} size={24} />
            <Text style={styles.backButtonText}>마이 페이지</Text>
          </TouchableOpacity>
          <Text style={styles.title}>매치 수정</Text>
          <Text style={styles.subtitle}>매치 정보를 수정해보세요.</Text>
        </View>

        <View style={styles.inputContainer}>
          <RequiredLabel text="제목" />
          <TextInput
            style={[
              styles.input,
              focusedInput === "title" && styles.inputFocused,
              errors.title && styles.inputError,
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
          {errors.title && <ErrorMessage error={errors.title} />}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <RequiredLabel text="코트 이름" />
            <TextInput
              style={[
                styles.input,
                focusedInput === "courtName" && styles.inputFocused,
                errors.courtName && styles.inputError,
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
            {errors.courtName && <ErrorMessage error={errors.courtName} />}
          </View>
          <View style={styles.halfInput}>
            <RequiredLabel text="위치" />
            <TextInput
              style={[
                styles.input,
                focusedInput === "location" && styles.inputFocused,
                errors.location && styles.inputError,
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
            {errors.location && <ErrorMessage error={errors.location} />}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RequiredLabel text="날짜 및 시간" />
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateTimeInput,
              errors.datetime && styles.inputError,
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formData.date
                ? `${formData.date} ${formData.time}`
                : "날짜와 시간을 선택하세요"}
            </Text>
          </TouchableOpacity>
          {errors.datetime && <ErrorMessage error={errors.datetime} />}

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
          <RequiredLabel text="레벨" />
          <TouchableOpacity
            style={[
              styles.input,
              styles.levelInput,
              errors.level && styles.inputError,
            ]}
            onPress={() => setShowLevelModal(true)}
          >
            <Text style={{ color: formData.level ? "#FFFFFF" : "#666" }}>
              {formData.level
                ? levelsWithLabel.find((l) => l.value === formData.level)?.label
                : "레벨을 선택해주세요"}
            </Text>
          </TouchableOpacity>
          {errors.level && <ErrorMessage error={errors.level} />}
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
            <RequiredLabel text="최대 인원" />
            <TextInput
              style={[
                styles.input,
                focusedInput === "maxPlayers" && styles.inputFocused,
                errors.maxPlayers && styles.inputError,
              ]}
              value={String(formData.maxPlayers)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  maxPlayers: parseInt(text) || 6,
                }))
              }
              keyboardType="numeric"
              placeholder="2~20명"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("maxPlayers")}
              onBlur={() => setFocusedInput("")}
            />
            {errors.maxPlayers && <ErrorMessage error={errors.maxPlayers} />}
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>참가비</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "cost" && styles.inputFocused,
                errors.cost && styles.inputError,
              ]}
              value={String(formData.cost)}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  cost: parseInt(text) || 0,
                }))
              }
              keyboardType="numeric"
              placeholder="0원 이상"
              placeholderTextColor="#666"
              onFocus={() => setFocusedInput("cost")}
              onBlur={() => setFocusedInput("")}
            />
            {errors.cost && <ErrorMessage error={errors.cost} />}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RequiredLabel text="매치 설명" />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              focusedInput === "description" && styles.inputFocused,
              errors.description && styles.inputError,
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
          {errors.description && <ErrorMessage error={errors.description} />}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.ruleHeader}>
            <RequiredLabel text="주의사항 (규칙)" />
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
                  errors.rules && styles.inputError,
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
          {errors.rules && <ErrorMessage error={errors.rules} />}
        </View>
        {errors.submit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.submit}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.submitButtonContainer}
          onPress={handleSubmit}
        >
          <GradientWithBox
            text="매치 수정하기"
            style={{ justifyContent: "center" }}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.medium,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.grey.light,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey.medium,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 20,
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
  input: {
    backgroundColor: colors.grey.dark,
    borderWidth: 1,
    borderColor: colors.grey.medium,
    borderRadius: 12,
    padding: 16,
    color: colors.white,
    fontSize: 16,
    height: 56,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requiredMark: {
    color: colors.error,
    marginLeft: 4,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateTimeInput: {
    justifyContent: "center",
  },
  dateTimeText: {
    color: colors.white,
  },
  levelInput: {
    justifyContent: "center",
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
    color: colors.white,
    fontSize: 16,
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
  ruleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
  addRuleButton: {
    color: colors.primary,
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
    backgroundColor: colors.grey.dark,
    borderRadius: 8,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: `${colors.error}20`,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
  },
  errorText: {
    color: colors.error,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey.medium,
  },
});
