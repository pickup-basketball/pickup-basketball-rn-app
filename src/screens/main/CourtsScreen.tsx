import React, { useState, useMemo, useEffect } from "react";
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
import axiosInstance from "../../api/axios-interceptor";

type Court = {
  id: number;
  name: string;
  address: string;
  location: string;
  images: string[];
  hoops: number;
  rating: number;
  bestTime: string;
  parking: boolean;
  facilities: string[];
  openingHours: string;
  restrictions: string;
  latitude: number;
  lighting: boolean;
  longitude: number;
  surface: string;
};

const CourtsScreen = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "map">("card");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [locationFilter, setLocationFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);

  // fetchCourts 함수를 수정해서 응답 데이터를 확인해보세요
  const fetchCourts = async () => {
    try {
      const response = await axiosInstance.get("/courts");
      console.log("서버 응답:", response.data); // 실제 데이터 구조 확인
      if (response.data?.data && Array.isArray(response.data.data)) {
        setCourts(response.data.data);
      }
    } catch (error) {
      console.error("코트 데이터 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const locations = useMemo(() => {
    return ["전체", ...new Set(courts.map((court) => court.location))];
  }, [courts]);

  const filteredCourts = useMemo(() => {
    if (locationFilter === "전체") return courts;
    return courts.filter((court) => court.location === locationFilter);
  }, [locationFilter, courts]);

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
        <Image source={{ uri: court.images?.[0] }} style={styles.courtImage} />
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
          {court.facilities?.map((facility, index) => (
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>코트 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default CourtsScreen;
