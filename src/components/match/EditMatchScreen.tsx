import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { colors } from "../../styles/colors";
import { GradientWithBox } from "../common/Gradient";
import { validateForm } from "../../utils/validators/matchValidator";
import { RouteProp } from "@react-navigation/native";
import { MyPageStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { LocationInputs } from "./write/LocationInputs";
import { Header } from "./write/Header";
import { useEditMatchForm } from "../../utils/hooks/useEditMatchForm";
import { useEditMatchSubmit } from "../../utils/hooks/useEditMatchSubmit";
import { TitleInput } from "./write/TitleInput";
import { DateTimePickerComponent } from "./write/DateTimePicker";
import {
  handleAddRule,
  handleDateTimeChange,
  handleRemoveRule,
  handleRuleChange,
} from "../../utils/match/formHandlers";
import { LevelSelector } from "./write/LevelSelector";
import { PlayersCostInputs } from "./write/PlayersCostInputs";
import { DescriptionInput } from "./write/DescriptionInput";
import { RulesInput } from "./write/RulesInput";

type EditMatchScreenProps = {
  route: RouteProp<MyPageStackParamList, "EditMatch">;
  navigation: StackNavigationProp<MyPageStackParamList, "EditMatch">;
};

const EditMatchScreen = ({ route, navigation }: EditMatchScreenProps) => {
  const { matchData } = route.params;

  const {
    formData,
    updateFormData,
    focusedInput,
    setFocusedInput,
    showDatePicker,
    setShowDatePicker,
    showLevelModal,
    setShowLevelModal,
  } = useEditMatchForm(matchData);

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const onSubmitPress = () => {
    console.log("Submitting form data:", formData);
    handleSubmit(formData);
  };

  const { handleSubmit, isLoading, errors } = useEditMatchSubmit(
    navigation,
    validateForm,
    matchData.id,
    matchData
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Header
          title="매치 수정"
          subtitle="매치 정보를 수정해보세요"
          navigation={navigation}
          backText="마이 페이지"
          onBack={() => navigation.goBack()}
        />

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
          onMaxPlayersChange={(text) =>
            updateFormData("maxPlayers", parseInt(text) || 6)
          }
          onCostChange={(text) => updateFormData("cost", parseInt(text) || 0)}
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
          onPress={onSubmitPress}
          disabled={isLoading}
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

export default EditMatchScreen;
