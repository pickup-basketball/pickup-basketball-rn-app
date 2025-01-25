import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { FilterPicker } from "./FilterPicker";

export const FilterSection = () => {
  const [locationFilter, setLocationFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const locations = [
    { label: "강남구", value: "gangnam" },
    { label: "송파구", value: "songpa" },
    { label: "마포구", value: "mapo" },
  ];

  const levels = [
    { label: "초급", value: "BEGINNER" },
    { label: "중급", value: "INTERMEDIATE" },
    { label: "상급", value: "ADVANCED" },
  ];

  return (
    <View style={styles.filterSection}>
      <FilterPicker
        selectedValue={locationFilter}
        onValueChange={setLocationFilter}
        items={locations}
        placeholder="전체 지역"
      />
      <FilterPicker
        selectedValue={levelFilter}
        onValueChange={setLevelFilter}
        items={levels}
        placeholder="전체 레벨"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
});
