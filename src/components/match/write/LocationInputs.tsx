import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../styles/colors";
import { ErrorMessage, RequiredLabel } from "../../common/form/FormElements";
import { TextInput } from "react-native-gesture-handler";

type LocationInputsProps = {
  courtName: string;
  district: string;
  locationDetail: string;
  onCourtNameChange: (text: string) => void;
  onDistrictChange: (text: string) => void;
  onLocationDetailChange: (text: string) => void;
  errors: {
    courtName?: string;
    district?: string;
    locationDetail?: string;
  };
  focusedInput: string;
  onFocus: (field: string) => void;
  onBlur: () => void;
};

export const LocationInputs = ({
  courtName,
  district,
  locationDetail,
  onCourtNameChange,
  onDistrictChange,
  onLocationDetailChange,
  errors,
  focusedInput,
  onFocus,
  onBlur,
}: LocationInputsProps) => (
  <View>
    <View style={styles.inputContainer}>
      <RequiredLabel text="코트 이름" />
      <TextInput
        style={[
          styles.input,
          focusedInput === "courtName" && styles.inputFocused,
          errors.courtName && styles.inputError,
        ]}
        value={courtName}
        onChangeText={onCourtNameChange}
        placeholder="예) 올림픽공원 농구장"
        placeholderTextColor="#666"
        onFocus={() => onFocus("courtName")}
        onBlur={onBlur}
      />
      {errors.courtName && <ErrorMessage error={errors.courtName} />}
    </View>

    <View style={styles.row}>
      <View style={styles.halfInput}>
        <RequiredLabel text="지역" />
        <TextInput
          style={[
            styles.input,
            focusedInput === "district" && styles.inputFocused,
            errors.district && styles.inputError,
          ]}
          value={district}
          onChangeText={onDistrictChange}
          placeholder="예) 서울 송파구"
          placeholderTextColor="#666"
          onFocus={() => onFocus("district")}
          onBlur={onBlur}
        />
        {errors.district && <ErrorMessage error={errors.district} />}
      </View>

      <View style={styles.halfInput}>
        <RequiredLabel text="상세 위치" />
        <TextInput
          style={[
            styles.input,
            focusedInput === "locationDetail" && styles.inputFocused,
            errors.locationDetail && styles.inputError,
          ]}
          value={locationDetail}
          onChangeText={onLocationDetailChange}
          placeholder="예) 방이동 88"
          placeholderTextColor="#666"
          onFocus={() => onFocus("locationDetail")}
          onBlur={onBlur}
        />
        {errors.locationDetail && (
          <ErrorMessage error={errors.locationDetail} />
        )}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  inputError: {
    borderColor: "#EF4444",
  },
});
