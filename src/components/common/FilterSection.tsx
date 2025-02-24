import React from "react";
import { View, StyleSheet } from "react-native";
import { FilterPicker } from "./FilterPicker";
import { Level, Post } from "../../types/match";

type TFilterSectionProps = {
  locationFilter: string;
  levelFilter: Level | "all";
  setLocationFilter: (value: string) => void;
  setLevelFilter: (value: Level | "all") => void;
  matches: Post[];
};

export const FilterSection = ({
  locationFilter,
  levelFilter,
  setLocationFilter,
  setLevelFilter,
  matches,
}: TFilterSectionProps) => {
  const uniqueDistricts = Array.from(
    new Set(matches.map((match) => match.district))
  ).filter(Boolean);

  const locations: Array<{ label: string; value: string }> = [
    { label: "전체 지역", value: "all" },
    ...uniqueDistricts.map((district) => ({
      label: district.includes("서울특별시 ")
        ? district.replace("서울특별시 ", "")
        : district,
      value: district,
    })),
  ];

  const levelMapping: Record<Level, string> = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "상급",
  };

  const uniqueLevels = Array.from(
    new Set(matches.map((match) => match.level))
  ).filter(Boolean) as Level[];

  const levels: Array<{ label: string; value: Level | "all" }> = [
    { label: "전체 레벨", value: "all" },
    ...uniqueLevels.map((level) => ({
      label: levelMapping[level] || level,
      value: level,
    })),
  ];

  return (
    <View style={styles.filterSection}>
      <FilterPicker<string>
        selectedValue={locationFilter}
        onValueChange={setLocationFilter}
        items={locations}
      />

      <FilterPicker<Level | "all">
        selectedValue={levelFilter}
        onValueChange={setLevelFilter}
        items={levels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
});
