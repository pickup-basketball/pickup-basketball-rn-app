import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Court } from "../../src/types/court";
import axiosInstance from "../../src/api/axios-interceptor";
import LoggedInHeader from "../../src/components/common/LoggedInHeader";
import { CourtsHeader } from "../../src/components/courts/CourtHeader";
import { LocationFilter } from "../../src/components/courts/LocationFilter";
import CourtDetailModal from "../../src/components/courts/CourtDetailModal";
import { CourtCard } from "../../src/components/courts/CourtCard";
import { colors } from "../../src/styles/colors";

const CourtsScreen = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "map">("card");
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [locationFilter, setLocationFilter] = useState("전체");

  const fetchCourts = async () => {
    try {
      const response = await axiosInstance.get("/courts");
      if (Array.isArray(response.data)) {
        setCourts(response.data);
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
      <CourtsHeader viewMode={viewMode} onViewModeChange={setViewMode} />
      <LocationFilter
        locations={locations}
        selectedLocation={locationFilter}
        onLocationSelect={setLocationFilter}
      />
      <CourtDetailModal
        selectedCourt={selectedCourt}
        onClose={() => setSelectedCourt(null)}
      />

      {viewMode === "card" ? (
        <FlatList
          data={filteredCourts}
          renderItem={({ item }) => (
            <CourtCard court={item} onSelect={setSelectedCourt} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.courtsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholder}>지도 뷰 구현 예정</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  courtsList: {
    padding: 20,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: colors.grey.dark,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholder: {
    color: colors.grey.medium,
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
