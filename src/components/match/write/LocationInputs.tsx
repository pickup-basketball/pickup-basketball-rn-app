import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Modal } from "react-native";
import { colors } from "../../../styles/colors";
import { ErrorMessage, RequiredLabel } from "../../common/form/FormElements";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import axiosInstance from "../../../api/axios-interceptor";

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
}: LocationInputsProps) => {
  const [districts, setDistricts] = useState<string[]>([]);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get("/matches/districts");
        const formattedDistricts = response.data.map(
          (district: string) => `서울특별시 ${district}`
        );
        setDistricts(formattedDistricts);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const getDisplayDistrict = (fullDistrict: string) => {
    return fullDistrict.replace("서울특별시 ", "");
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.row}>
        <View style={styles.districtInput}>
          <RequiredLabel text="지역" />
          <TouchableOpacity
            style={[
              styles.input,
              styles.selectButton,
              errors.district && styles.inputError,
            ]}
            onPress={() => setShowDistrictModal(true)}
          >
            <Text style={styles.selectButtonText}>
              {district ? getDisplayDistrict(district) : "지역을 선택하세요"}
            </Text>
          </TouchableOpacity>
          {errors.district && <ErrorMessage error={errors.district} />}
        </View>

        <View style={styles.courtNameInput}>
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
      </View>

      <View style={styles.detailInput}>
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

      <Modal
        visible={showDistrictModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>지역 선택</Text>
            <ScrollView style={styles.districtList}>
              {districts.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.districtItem}
                  onPress={() => {
                    onDistrictChange(item);
                    setShowDistrictModal(false);
                  }}
                >
                  <Text style={styles.districtItemText}>
                    {getDisplayDistrict(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDistrictModal(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 16,
  },
  districtInput: {
    flex: 2,
  },
  courtNameInput: {
    flex: 3,
  },
  detailInput: {
    width: "100%",
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
  selectButton: {
    justifyContent: "center",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  districtList: {
    maxHeight: 300,
  },
  districtItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#3F3F46",
  },
  districtItemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
