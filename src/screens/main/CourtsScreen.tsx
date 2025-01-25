import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Grid,
  Map as MapIcon,
  MapPin,
  Clock,
  ParkingCircle,
  Star,
} from "lucide-react-native";
import LoggedInHeader from "../../components/common/LoggedInHeader";
import { colors } from "../../styles/colors";

// 타입 정의
type Court = {
  id: number;
  name: string;
  address: string;
  location: string;
  description: string;
  images: string[];
  hoops: number;
  rating: number;
  bestTime: string;
  parking: boolean;
  facilities: string[];
  openingHours: string;
  restrictions: string;
};

// 더미 데이터
const DUMMY_COURTS: Court[] = [
  {
    id: 1,
    name: "올림픽공원 농구장",
    address: "서울특별시 송파구 올림픽로 424",
    location: "송파구",
    description:
      "올림픽공원 내에 위치한 야외 농구장입니다. 총 4개의 코트가 있으며, 바닥 상태가 매우 좋습니다.",
    images: ["/images/courts/olympic-park.jpg"],
    hoops: 8,
    rating: 4.5,
    bestTime: "저녁",
    parking: true,
    facilities: ["화장실", "조명", "음수대"],
    openingHours: "06:00 - 22:00",
    restrictions: "공원 내 취사 금지",
  },
  {
    id: 2,
    name: "한강공원 농구장",
    address: "서울특별시 영등포구 여의동로 330",
    location: "영등포구",
    description:
      "한강변에 위치한 농구장으로, 시원한 강바람을 맞으며 운동할 수 있습니다.",
    images: ["/images/courts/hangang-park.jpg"],
    hoops: 4,
    rating: 4.0,
    bestTime: "아침",
    parking: true,
    facilities: ["화장실", "편의점", "자판기"],
    openingHours: "24시간",
    restrictions: "우천시 이용 제한",
  },
  {
    id: 3,
    name: "강남구민체육센터 농구장",
    address: "서울특별시 강남구 삼성로 168",
    location: "강남구",
    description: "실내 농구장으로, 날씨와 관계없이 이용 가능합니다.",
    images: ["/images/courts/gangnam-center.jpg"],
    hoops: 6,
    rating: 5.0,
    bestTime: "주말",
    parking: true,
    facilities: ["샤워실", "락커룸", "매점"],
    openingHours: "06:00 - 22:00",
    restrictions: "회원제 운영",
  },
  {
    id: 4,
    name: "마포구민체육센터",
    address: "서울특별시 마포구 백범로 235",
    location: "마포구",
    description: "깨끗하고 관리가 잘 되어있는 실내 농구장입니다.",
    images: ["/images/courts/mapo-center.jpg"],
    hoops: 4,
    rating: 4.0,
    bestTime: "오후",
    parking: true,
    facilities: ["화장실", "샤워실", "음수대"],
    openingHours: "09:00 - 21:00",
    restrictions: "실내화 필수",
  },
  {
    id: 5,
    name: "노원마을 농구장",
    address: "서울특별시 노원구 동일로 1286",
    location: "노원구",
    description: "동네 주민들이 자주 이용하는 아늑한 농구장입니다.",
    images: ["/images/courts/nowon-court.jpg"],
    hoops: 2,
    rating: 3.5,
    bestTime: "저녁",
    parking: false,
    facilities: ["벤치", "조명"],
    openingHours: "24시간",
    restrictions: "없음",
  },
  {
    id: 6,
    name: "서초실내체육관",
    address: "서울특별시 서초구 반포대로 58",
    location: "서초구",
    description: "전문적인 시설을 갖춘 실내 농구장입니다.",
    images: ["/images/courts/seocho-gym.jpg"],
    hoops: 6,
    rating: 4.5,
    bestTime: "오전",
    parking: true,
    facilities: ["샤워실", "락커룸", "체력단련실"],
    openingHours: "06:00 - 22:00",
    restrictions: "회원 우선",
  },
];

const CourtsScreen = () => {
  const [viewMode, setViewMode] = useState<"card" | "map">("card");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [locationFilter, setLocationFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const locations = useMemo(() => {
    return ["전체", ...new Set(DUMMY_COURTS.map((court) => court.location))];
  }, []);

  const filteredCourts = useMemo(() => {
    if (locationFilter === "전체") return DUMMY_COURTS;
    return DUMMY_COURTS.filter((court) => court.location === locationFilter);
  }, [locationFilter]);

  const renderStars = (rating: number) => {
    return (
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
  };

  const CourtCard = ({ court }: { court: Court }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedCourt(court)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: court.images[0] }}
          style={styles.courtImage}
          // defaultSource={require("../assets/default-court.jpg")}
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
              <MapPin size={16} color="#666666" />
              <Text style={styles.addressText}>{court.address}</Text>
            </View>
          </View>
          {renderStars(court.rating)}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#666666" />
            <Text style={styles.infoText}>추천시간: {court.bestTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <ParkingCircle size={16} color="#666666" />
            <Text style={styles.infoText}>
              {court.parking ? "주차가능" : "주차불가"}
            </Text>
          </View>
        </View>

        <View style={styles.facilitiesContainer}>
          {court.facilities.map((facility, index) => (
            <View key={index} style={styles.facilityBadge}>
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => setSelectedCourt(court)}
        >
          <Text style={styles.detailButtonText}>상세보기</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
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
            onPress={() => setViewMode("card")}
          >
            <Grid size={20} color={viewMode === "card" ? "#fff" : "#666666"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === "map" && styles.activeViewMode,
            ]}
            onPress={() => setViewMode("map")}
          >
            <MapIcon
              size={20}
              color={viewMode === "map" ? "#fff" : "#666666"}
            />
          </TouchableOpacity>
        </View>
      </View>

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
                locationFilter === location && styles.activeFilter,
              ]}
              onPress={() => setLocationFilter(location)}
            >
              <Text
                style={[
                  styles.filterText,
                  locationFilter === location && styles.activeFilterText,
                ]}
              >
                {location === "전체" ? "전체 지역" : location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {viewMode === "card" ? (
        <FlatList
          data={filteredCourts}
          renderItem={({ item }) => <CourtCard court={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.courtsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>지도 뷰 구현 예정</Text>
        </View>
      )}

      <Modal
        visible={!!selectedCourt}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCourt(null)}
      >
        {selectedCourt && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCourt.name}</Text>
              {/* 모달 내용 구현 */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCourt(null)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  viewModeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  activeViewMode: {
    backgroundColor: "#FF8800",
  },
  filterContainer: {
    padding: 20,
    backgroundColor: "#1a1a1a",
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
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#FF8800",
  },
  filterText: {
    color: "#666666",
  },
  activeFilterText: {
    color: "#fff",
  },
  courtsList: {
    padding: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
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
    color: "#fff",
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
    color: "#fff",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    color: "#666666",
    fontSize: 12,
  },
  starContainer: {
    flexDirection: "row",
    gap: 2,
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
    color: "#666666",
    fontSize: 12,
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  facilityBadge: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  facilityText: {
    color: "#666666",
    fontSize: 12,
  },
  detailButton: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholder: {
    color: "#666666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "50%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#FF8800",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CourtsScreen;
