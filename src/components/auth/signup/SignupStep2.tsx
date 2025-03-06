import { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import {
  TSignupStep2Props,
  TPosition,
  TLevel,
  positions,
  levels,
  positionMapping,
  levelsWithLabel,
} from "../../../types/signup";
import { useNavigation } from "@react-navigation/native";
import { validateSignupStep2 } from "../../../utils/validators/signupValidator";
import { TNavigationProp } from "../../../types/navigation";
import { colors } from "../../../styles/colors";

const SignupStep2: React.FC<TSignupStep2Props> = ({
  step1Data,
  onPrevious,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    position: "" as TPosition,
    level: "" as TLevel,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [touchedFields, setTouchedFields] = useState({
    height: false,
    weight: false,
    position: false,
    level: false,
  });
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const navigation = useNavigation<TNavigationProp>();

  const validateForm = () => {
    // 모든 필드가 입력되었는지 확인
    const newErrors: string[] = [];

    if (!formData.height) {
      newErrors.push("키를 입력해주세요.");
    } else if (Number(formData.height) < 130 || Number(formData.height) > 250) {
      newErrors.push("키는 130cm에서 250cm 사이여야 합니다.");
    }

    if (!formData.weight) {
      newErrors.push("몸무게를 입력해주세요.");
    } else if (Number(formData.weight) < 30 || Number(formData.weight) > 200) {
      newErrors.push("몸무게는 30kg에서 200kg 사이여야 합니다.");
    }

    if (!formData.position) {
      newErrors.push("선호 포지션을 선택해주세요.");
    }

    if (!formData.level) {
      newErrors.push("실력 수준을 선택해주세요.");
    }

    // 모든 필드를 터치된 상태로 설정
    setTouchedFields({
      height: true,
      weight: true,
      position: true,
      level: true,
    });

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();

    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    // 이미 validateForm에서 필수값 체크를 했지만, validateSignupStep2 함수도 호출하여 추가 검증
    const validationErrors = validateSignupStep2({ ...step1Data, ...formData });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({ ...step1Data, ...formData });
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  const handleSelectPosition = (position: TPosition) => {
    setFormData((prev) => ({
      ...prev,
      position: position,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      position: true,
    }));
    setShowPositionModal(false);

    // 포지션 선택 시 관련 에러 제거
    setErrors((prev) => prev.filter((error) => !error.includes("포지션")));
  };

  const handleSelectLevel = (level: TLevel) => {
    setFormData((prev) => ({
      ...prev,
      level: level,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      level: true,
    }));
    setShowLevelModal(false);

    // 레벨 선택 시 관련 에러 제거
    setErrors((prev) => prev.filter((error) => !error.includes("실력")));
  };

  const handleInputChange = (field: "height" | "weight", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // 입력 시 관련 에러 제거
    if (field === "height") {
      setErrors((prev) => prev.filter((error) => !error.includes("키")));
    } else if (field === "weight") {
      setErrors((prev) => prev.filter((error) => !error.includes("몸무게")));
    }
  };

  // 포지션 항목 렌더링 - 한국어 표기로 변경
  const renderPositionItem = ({ item }: { item: TPosition }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectPosition(item)}
    >
      <Text style={styles.modalItemText}>{positionMapping[item]}</Text>
    </TouchableOpacity>
  );

  // 레벨 항목 렌더링 - 한국어 표기로 변경
  const renderLevelItem = ({ item }: { item: TLevel }) => {
    const levelWithLabel = levelsWithLabel.find(
      (level) => level.value === item
    );

    return (
      <TouchableOpacity
        style={styles.modalItem}
        onPress={() => handleSelectLevel(item)}
      >
        <Text style={styles.modalItemText}>
          {levelWithLabel ? levelWithLabel.label : item}
        </Text>
      </TouchableOpacity>
    );
  };

  // 선택된 포지션 한국어 표시
  const getSelectedPositionLabel = () => {
    if (!formData.position) return "";
    return positionMapping[formData.position];
  };

  // 선택된 레벨 한국어 표시
  const getSelectedLevelLabel = () => {
    if (!formData.level) return "";
    const levelWithLabel = levelsWithLabel.find(
      (level) => level.value === formData.level
    );
    return levelWithLabel ? levelWithLabel.label : formData.level;
  };

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>키</Text>
        <TextInput
          style={[
            styles.input,
            touchedFields.height && !formData.height ? styles.inputError : null,
          ]}
          placeholder="cm"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) => handleInputChange("height", text)}
          selectionColor={colors.primary}
        />

        <Text style={styles.label}>몸무게</Text>
        <TextInput
          style={[
            styles.input,
            touchedFields.weight && !formData.weight ? styles.inputError : null,
          ]}
          placeholder="kg"
          placeholderTextColor="#A0A0A0"
          value={formData.weight}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange("weight", text)}
          selectionColor={colors.primary}
        />

        <Text style={styles.label}>선호 포지션</Text>
        <TouchableOpacity
          style={[
            styles.input,
            touchedFields.position && !formData.position
              ? styles.inputError
              : null,
          ]}
          onPress={() => setShowPositionModal(true)}
        >
          <Text
            style={
              formData.position ? styles.selectedText : styles.placeholderText
            }
          >
            {formData.position
              ? getSelectedPositionLabel()
              : "포지션을 선택해주세요"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>실력 수준</Text>
        <TouchableOpacity
          style={[
            styles.input,
            touchedFields.level && !formData.level ? styles.inputError : null,
          ]}
          onPress={() => setShowLevelModal(true)}
        >
          <Text
            style={
              formData.level ? styles.selectedText : styles.placeholderText
            }
          >
            {formData.level
              ? getSelectedLevelLabel()
              : "실력 수준을 선택해주세요"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 에러 메시지 표시 영역 */}
      {errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      {/* Position Modal */}
      <Modal
        visible={showPositionModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>포지션 선택</Text>
            <FlatList
              data={positions}
              renderItem={renderPositionItem}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPositionModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Level Modal */}
      <Modal visible={showLevelModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>실력 수준 선택</Text>
            <FlatList
              data={levels}
              renderItem={renderLevelItem}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLevelModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.signButtonContainer}>
        <TouchableOpacity
          style={[styles.signupButton, styles.previousButton]}
          onPress={onPrevious}
        >
          <Text style={styles.signupButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.signupButton]} onPress={handleSubmit}>
          <Text style={styles.signupButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#FF7A7A",
    borderWidth: 1.5,
  },
  errorsContainer: {
    backgroundColor: "rgba(255, 122, 122, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 122, 122, 0.2)",
  },
  errorText: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  signupButton: {
    flex: 1,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  signButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  previousButton: {
    backgroundColor: "#696969",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
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
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
});

export default SignupStep2;
