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
import { TStep1Data } from "./SignupStep1";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TSignupData = TStep1Data & {
  height: string;
  weight: string;
  position: string;
  level: string;
};

export type TSignupStep2Props = {
  step1Data: TStep1Data;
  onPrevious: () => void;
  onSubmit: (allData: TSignupData) => void;
};

type TPosition = {
  position: string;
  value: string;
};

type TLevel = {
  level: string;
  value: string;
};

// 네비게이션에서 사용할 스크린들의 타입 정의
type RootStackParamList = {
  Matching: undefined;
};

// navigation 타입 정의
type TNavigationProp = StackNavigationProp<RootStackParamList>;

const SignupStep2 = ({
  step1Data,
  onPrevious,
  onSubmit,
}: TSignupStep2Props) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    position: "",
    level: "",
  });
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const navigation = useNavigation<TNavigationProp>();

  const handleSubmit = async () => {
    await onSubmit({
      ...step1Data,
      ...formData,
    });

    await AsyncStorage.setItem("isLoggedIn", "true");

    navigation.navigate("Matching");
  };

  const positions: TPosition[] = [
    { position: "Point Guard (PG)", value: "PG" },
    { position: "Shooting Guard (SG)", value: "SG" },
    { position: "Small Forward (SF)", value: "SF" },
    { position: "Power Forward (PF)", value: "PF" },
    { position: "Center (C)", value: "C" },
  ];

  const levels: TLevel[] = [
    { level: "초급", value: "BEGINNER" },
    { level: "중급", value: "INTERMEDIATE" },
    { level: "상급", value: "ADVANCED" },
  ];

  const handleSelectPosition = (position: TPosition) => {
    setFormData((prev) => ({
      ...prev,
      position: position.value,
    }));
    setShowPositionModal(false);
  };

  const handleSelectLevel = (level: TLevel) => {
    setFormData((prev) => ({
      ...prev,
      level: level.value,
    }));
    setShowLevelModal(false);
  };

  const renderPositionItem = ({ item }: { item: TPosition }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectPosition(item)}
    >
      <Text style={styles.modalItemText}>{item.position}</Text>
    </TouchableOpacity>
  );

  const renderLevelItem = ({ item }: { item: TLevel }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelectLevel(item)}
    >
      <Text style={styles.modalItemText}>{item.level}</Text>
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
              ? positions.find((p) => p.value === formData.position)?.position
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
              ? levels.find((l) => l.value === formData.level)?.level
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
              keyExtractor={(item) => item.value}
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
              keyExtractor={(item) => item.value}
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
        <TouchableOpacity
          style={[styles.signupButton]}
          onPress={() => {
            handleSubmit();
            navigation.navigate("Matching");
          }}
        >
          <Text style={styles.signupButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButton: {
    color: "#fff",
    fontSize: 16,
  },
  titleContainer: {
    marginTop: -10,
    marginBottom: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
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
  nickNameInput: {
    backgroundColor: "#3E3E3E",
    borderWidth: 1,
    borderColor: "#696969",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
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
  splitButton: {
    flex: 1,
  },
  previousButton: {
    backgroundColor: "#696969",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLink: {
    color: "#ff6b00",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  mainButton: {
    padding: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    bottom: 1,
  },
  signupStageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 10,
  },
  currentSignupStage: {
    backgroundColor: "#F97316",
    borderRadius: 10,
    height: 5,
    width: 20,
    flex: 1,
  },
  signupStage: {
    backgroundColor: "#8A410E",
    borderRadius: 10,
    height: 5,
    width: 20,
    flex: 1,
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
