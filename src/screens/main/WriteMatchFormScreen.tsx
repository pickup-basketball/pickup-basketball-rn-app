// screens/match/WriteMatchForm.tsx
import React from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WriteScreenNavigationProp } from "../../types/navigation";
import { GradientWithBox } from "../../components/common/Gradient";
import { useMatchForm } from "../../utils/hooks/useMatchForm";
import { useMatchValidation } from "../../utils/hooks/useMatchValidation";
import { useMatchSubmit } from "../../utils/hooks/useMatchSubmit";
import { Header } from "../../components/match/write/Header";
import { TitleInput } from "../../components/match/write/TitleInput";
import { LocationInputs } from "../../components/match/write/LocationInputs";
import { DateTimePickerComponent } from "../../components/match/write/DateTimePicker";
import {
  handleAddRule,
  handleDateTimeChange,
  handleRemoveRule,
  handleRuleChange,
} from "../../utils/match/formHandlers";
import { LevelSelector } from "../../components/match/write/LevelSelector";
import { PlayersCostInputs } from "../../components/match/write/PlayersCostInputs";
import { DescriptionInput } from "../../components/match/write/DescriptionInput";
import { RulesInput } from "../../components/match/write/RulesInput";

type Props = {
  navigation: WriteScreenNavigationProp;
};

const WriteMatchForm = ({ navigation }: Props) => {
  const {
    formData,
    updateFormData,
    focusedInput,
    setFocusedInput,
    showDatePicker,
    setShowDatePicker,
    showLevelModal,
    setShowLevelModal,
  } = useMatchForm();

  const { validateMatchForm } = useMatchValidation();
  const { handleSubmit, isLoading, errors } = useMatchSubmit(
    navigation,
    validateMatchForm
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Header navigation={navigation} />

        <TitleInput
          value={formData.title}
          onChange={(text) => updateFormData("title", text)}
          error={errors.title}
          onFocus={() => setFocusedInput("title")}
          onBlur={() => setFocusedInput("")}
          isFocused={focusedInput === "title"}
        />

        <LocationInputs
          courtName={formData.courtName}
          district={formData.district}
          locationDetail={formData.locationDetail}
          onCourtNameChange={(text) => updateFormData("courtName", text)}
          onDistrictChange={(text) => updateFormData("district", text)}
          onLocationDetailChange={(text) =>
            updateFormData("locationDetail", text)
          }
          errors={{
            courtName: errors.courtName,
            district: errors.district,
            locationDetail: errors.locationDetail,
          }}
          focusedInput={focusedInput}
          onFocus={setFocusedInput}
          onBlur={() => setFocusedInput("")}
        />

        <DateTimePickerComponent
          date={formData.date}
          time={formData.time}
          onDateTimeChange={(event, selectedDate) =>
            handleDateTimeChange(selectedDate, updateFormData)
          }
          error={errors.datetime}
          showPicker={showDatePicker}
          onPress={() => setShowDatePicker(true)}
        />

        <LevelSelector
          level={formData.level}
          onLevelSelect={(level) => updateFormData("level", level)}
          error={errors.level}
          showModal={showLevelModal}
          onModalOpen={() => setShowLevelModal(true)}
          onModalClose={() => setShowLevelModal(false)}
        />

        <PlayersCostInputs
          maxPlayers={formData.maxPlayers}
          cost={formData.cost}
          onMaxPlayersChange={(text) => {
            // 빈 문자열이면 undefined 또는 null로, 값이 있으면 숫자로 변환
            const value = text === "" ? null : parseInt(text);
            updateFormData("maxPlayers", value);
          }}
          onCostChange={(text) => {
            // 빈 문자열이면 undefined 또는 null로, 값이 있으면 숫자로 변환
            const value = text === "" ? null : parseInt(text);
            updateFormData("cost", value);
          }}
          errors={{
            maxPlayers: errors.maxPlayers,
            cost: errors.cost,
          }}
          focusedInput={focusedInput}
          onFocus={setFocusedInput}
          onBlur={() => setFocusedInput("")}
        />

        <DescriptionInput
          value={formData.description}
          onChange={(text) => updateFormData("description", text)}
          error={errors.description}
          onFocus={() => setFocusedInput("description")}
          onBlur={() => setFocusedInput("")}
          isFocused={focusedInput === "description"}
        />

        <RulesInput
          rules={formData.rules}
          onRuleChange={(index, text) =>
            handleRuleChange(index, text, formData.rules, updateFormData)
          }
          onAddRule={() => handleAddRule(formData.rules, updateFormData)}
          onRemoveRule={(index) =>
            handleRemoveRule(index, formData.rules, updateFormData)
          }
          error={errors.rules}
          focusedInput={focusedInput}
          onFocus={setFocusedInput}
          onBlur={() => setFocusedInput("")}
        />

        {errors.submit && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.submit}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.submitButtonContainer}
          onPress={() => handleSubmit(formData)}
          disabled={isLoading}
        >
          <GradientWithBox
            text="매치 생성하기"
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
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 5,
  },
  errorText: {
    color: "#FF0000",
    textAlign: "center",
  },
  submitButtonContainer: {
    marginVertical: 20,
  },
});

export default WriteMatchForm;
