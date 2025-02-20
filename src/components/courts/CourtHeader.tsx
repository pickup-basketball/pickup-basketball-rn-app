import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Grid, Map as MapIcon } from "lucide-react-native";
import { colors } from "../../styles/colors";

interface CourtsHeaderProps {
  viewMode: "card" | "map";
  onViewModeChange: (mode: "card" | "map") => void;
}

export const CourtsHeader = ({
  viewMode,
  onViewModeChange,
}: CourtsHeaderProps) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.title}>추천 농구장</Text>
      <Text style={styles.subtitle}>서울시 야외 농구장을 찾아보세요</Text>
    </View>
    <View style={styles.viewModeContainer}>
      <TouchableOpacity
        style={[
          styles.viewModeButton,
          viewMode === "card" && styles.activeViewMode,
        ]}
        onPress={() => onViewModeChange("card")}
      >
        <Grid
          size={20}
          color={viewMode === "card" ? colors.white : colors.grey.medium}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.viewModeButton,
          viewMode === "map" && styles.activeViewMode,
        ]}
        onPress={() => onViewModeChange("map")}
      >
        <MapIcon
          size={20}
          color={viewMode === "map" ? colors.white : colors.grey.medium}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey.medium,
    marginTop: 4,
  },
  viewModeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    backgroundColor: colors.grey.dark,
    borderRadius: 8,
  },
  activeViewMode: {
    backgroundColor: colors.primary,
  },
});
