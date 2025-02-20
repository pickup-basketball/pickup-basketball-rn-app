import { StyleSheet, View } from "react-native";
import { Star } from "lucide-react-native";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => (
  <View style={styles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? "#FFB800" : "#666666"}
        fill={index < rating ? "#FFB800" : "none"}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    gap: 2,
  },
});
