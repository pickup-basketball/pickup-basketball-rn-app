import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/colors";

interface LocationFilterProps {
  locations: string[];
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

export const LocationFilter = ({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationFilterProps) => (
  <View style={styles.filterContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.locationFilter}
    >
      {locations.map((location) => (
        <TouchableOpacity
          key={location}
          style={[
            styles.filterButton,
            selectedLocation === location && styles.activeFilter,
          ]}
          onPress={() => onLocationSelect(location)}
        >
          <Text
            style={[
              styles.filterText,
              selectedLocation === location && styles.activeFilterText,
            ]}
          >
            {location === "전체" ? "전체 지역" : location}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  filterContainer: {
    padding: 20,
    backgroundColor: colors.grey.dark,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationFilter: {
    flexGrow: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.grey.medium,
  },
  activeFilterText: {
    color: colors.white,
  },
});
