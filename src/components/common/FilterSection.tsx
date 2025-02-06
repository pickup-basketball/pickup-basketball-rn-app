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
  // 위치 필터
  const locations: Array<{ label: string; value: string }> = [
    { label: "전체 지역", value: "all" },
    ...Array.from(new Set(matches.map((match) => match.location))).map(
      (location) => ({
        label: location.replace("서울시 ", ""),
        value: location,
      })
    ),
  ];

  // 레벨 필터
  const levelMapping: Record<Level, string> = {
    BEGINNER: "초급",
    INTERMEDIATE: "중급",
    ADVANCED: "상급",
  };

  const levels: Array<{ label: string; value: Level | "all" }> = [
    { label: "전체 레벨", value: "all" },
    ...Array.from(new Set(matches.map((match) => match.level))).map(
      (level) => ({
        label: levelMapping[level as Level],
        value: level as Level,
      })
    ),
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
