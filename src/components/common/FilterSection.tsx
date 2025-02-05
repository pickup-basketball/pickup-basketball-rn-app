import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { FilterPicker } from "./FilterPicker";
import { Level } from "../../types/match";

type TFilterSectionProps = {
  locationFilter: string;
  levelFilter: Level | "all";
  setLocationFilter: (value: string) => void;
  setLevelFilter: (value: Level | "all") => void;
};

export const FilterSection = ({
  locationFilter,
  levelFilter,
  setLocationFilter,
  setLevelFilter,
}: TFilterSectionProps) => {
  const locations: { label: string; value: string }[] = [
    { label: "강남구", value: "gangnam" },
    { label: "송파구", value: "songpa" },
    { label: "마포구", value: "mapo" },
  ];

  const levels: { label: string; value: Level | "all" }[] = [
    { label: "초급", value: "BEGINNER" },
    { label: "중급", value: "INTERMEDIATE" },
    { label: "상급", value: "ADVANCED" },
  ];

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
  };

  const handleLevelChange = (value: Level | "all") => {
    setLevelFilter(value);
  };

  return (
    <View style={styles.filterSection}>
      <FilterPicker<string>
        selectedValue={locationFilter}
        onValueChange={handleLocationChange}
        items={locations}
        placeholder="전체 지역"
      />

      <FilterPicker<Level | "all">
        selectedValue={levelFilter}
        onValueChange={handleLevelChange}
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
