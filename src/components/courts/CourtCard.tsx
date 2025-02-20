import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock, MapPin, ParkingCircle } from "lucide-react-native";
import { Court } from "../../types/court";
import { courtImages } from "../../constants/courtImages";
import { colors } from "../../styles/colors";
import { StarRating } from "./StarRating";

interface CourtCardProps {
  court: Court;
  onSelect: (court: Court) => void;
}

export const CourtCard = ({ court, onSelect }: CourtCardProps) => (
  <TouchableOpacity style={styles.card} onPress={() => onSelect(court)}>
    <View style={styles.imageContainer}>
      <Image
        source={
          court.images?.[0] && courtImages[court.images[0]]
            ? courtImages[court.images[0]]
            : require("../../../assets/icon.png")
        }
        style={styles.courtImage}
      />
      <View style={styles.hoopsBadge}>
        <Text style={styles.hoopsText}>{court.hoops}개 링</Text>
      </View>
    </View>

    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.courtName}>{court.name}</Text>
          <View style={styles.addressContainer}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.addressText}>{court.address}</Text>
          </View>
        </View>
        <StarRating rating={court.rating} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.infoText}>추천시간: {court.bestTime}</Text>
        </View>
        <View style={styles.infoItem}>
          <ParkingCircle size={16} color={colors.primary} />
          <Text style={styles.infoText}>
            {court.parking ? "주차가능" : "주차불가"}
          </Text>
        </View>
      </View>

      <View style={styles.facilitiesContainer}>
        {court.facilities?.map((facility, index) => (
          <View key={index} style={styles.facilityBadge}>
            <Text style={styles.facilityText}>{facility}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onSelect(court)}
      >
        <Text style={styles.detailButtonText}>상세보기</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.grey.dark,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  imageContainer: {
    height: 200,
    position: "relative",
  },
  courtImage: {
    width: "100%",
    height: "100%",
  },
  hoopsBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  hoopsText: {
    color: colors.white,
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  courtName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    color: colors.white,
    fontSize: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: colors.white,
    fontSize: 12,
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  facilityBadge: {
    backgroundColor: colors.grey.dark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  facilityText: {
    color: colors.white,
    fontSize: 12,
  },
  detailButton: {
    backgroundColor: colors.grey.dark,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});
