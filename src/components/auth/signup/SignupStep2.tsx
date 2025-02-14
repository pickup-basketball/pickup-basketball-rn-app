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
} from "../../../types/signup";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateSignupStep2 } from "../../../utils/validators/signupValidator";
import { TNavigationProp } from "../../../types/navigation";

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
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const navigation = useNavigation<TNavigationProp>();

  const handleSubmit = async () => {
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
    setShowPositionModal(false);
  };

  const handleSelectLevel = (level: TLevel) => {
    setFormData((prev) => ({
      ...prev,
      level: level,
    }));
    setShowLevelModal(false);
  };

  const renderPositionItem = ({ item }: { item: TPosition }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectPosition(item)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderLevelItem = ({ item }: { item: TLevel }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectLevel(item)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>키</Text>
        <TextInput
          style={styles.input}
          placeholder="cm"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, height: text }))
          }
        />
        <Text style={styles.label}>무게</Text>
        <TextInput
          style={styles.input}
          placeholder="kg"
          placeholderTextColor="#666"
          value={formData.weight}
          keyboardType="numeric"
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, weight: text }))
          }
        />
        <Text style={styles.label}>선호 포지션</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPositionModal(true)}
        >
          <Text
            style={
              formData.position ? styles.selectedText : styles.placeholderText
            }
          >
            {formData.position
              ? positions.find((p) => p === formData.position)
              : "포지션을 선택해주세요"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.label}>실력 수준</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowLevelModal(true)}
        >
          <Text
            style={
              formData.level ? styles.selectedText : styles.placeholderText
            }
          >
            {formData.level
              ? levels.find((l) => l === formData.level)
              : "실력 수준을 선택해주세요"}
          </Text>
        </TouchableOpacity>
      </View>

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
