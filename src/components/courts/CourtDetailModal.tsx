import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MapPin, Clock, ParkingCircle } from "lucide-react-native";
import { colors } from "../../styles/colors";
import { Court } from "../../types/court";
import { courtImages } from "../../constants/courtImages";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface CourtDetailModalProps {
  selectedCourt: Court | null;
  onClose: () => void;
}

export const CourtDetailModal: React.FC<CourtDetailModalProps> = ({
  selectedCourt,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!selectedCourt) return null;

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 이미지 캐러셀 섹션 */}
            <View style={styles.carouselContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const offset = e.nativeEvent.contentOffset.x;
                  setCurrentImageIndex(
                    Math.round(offset / (SCREEN_WIDTH - 40))
                  );
                }}
                scrollEventThrottle={16}
              >
                {selectedCourt.images.map((image, index) => (
                  <Image
                    key={index}
                    source={courtImages[image]}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              <View style={styles.paginationContainer}>
                {selectedCourt.images.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === idx && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* 농구장 기본 정보 */}
            <Text style={styles.modalTitle}>{selectedCourt.name}</Text>

            <View style={styles.sectionContainer}>
              <View style={styles.modalInfoItem}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.modalInfoText}>
                  {selectedCourt.address}
                </Text>
              </View>

              <View style={styles.modalInfoItem}>
                <Clock size={20} color={colors.primary} />
                <Text style={styles.modalInfoText}>
                  추천시간: {selectedCourt.bestTime}
                </Text>
              </View>

              <View style={styles.modalInfoItem}>
                <ParkingCircle size={20} color={colors.primary} />
                <Text style={styles.modalInfoText}>
                  주차: {selectedCourt.parking ? "가능" : "불가"}
                </Text>
              </View>
            </View>

            {/* 시설 정보 */}
            <Text style={styles.modalSectionTitle}>시설 정보</Text>
            <View style={styles.modalFacilitiesContainer}>
              {selectedCourt.facilities.map((facility, index) => (
                <View key={index} style={styles.modalFacilityBadge}>
                  <Text style={styles.modalFacilityText}>{facility}</Text>
                </View>
              ))}
            </View>

            {/* 추가 정보 */}
            <Text style={styles.modalSectionTitle}>추가 정보</Text>
            <View style={styles.sectionContainer}>
              <View style={styles.modalInfoItem}>
                <Text style={styles.modalInfoLabel}>표면:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedCourt.surface}
                </Text>
              </View>
              <View style={styles.modalInfoItem}>
                <Text style={styles.modalInfoLabel}>조명:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedCourt.lighting ? "있음" : "없음"}
                </Text>
              </View>
              <View style={styles.modalInfoItem}>
                <Text style={styles.modalInfoLabel}>농구대 수:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedCourt.hoops}개
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const COMMON_SPACING = 16;
const COMMON_RADIUS = 12;

const styles = StyleSheet.create({
  // 컨테이너 관련
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "50%",
  },
  carouselContainer: {
    position: "relative",
    marginBottom: COMMON_SPACING,
  },

  // 섹션 컨테이너
  sectionContainer: {
    backgroundColor: colors.grey.dark,
    borderRadius: COMMON_RADIUS,
    padding: COMMON_SPACING,
    marginBottom: COMMON_SPACING,
  },

  // 이미지 관련
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: 250,
    borderRadius: COMMON_RADIUS,
    marginBottom: COMMON_SPACING,
  },

  // 텍스트 스타일
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: COMMON_SPACING,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 12,
  },
  modalInfoText: {
    color: colors.white,
    fontSize: 14,
  },
  modalInfoLabel: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
  modalFacilityText: {
    color: colors.white,
    fontSize: 12,
  },

  // 버튼 관련
  closeButton: {
    backgroundColor: colors.primary,
    padding: COMMON_SPACING,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },

  // 레이아웃 관련
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  modalFacilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: COMMON_SPACING,
  },
  modalFacilityBadge: {
    backgroundColor: colors.grey.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  // 페이지네이션
  paginationContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grey.medium,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default CourtDetailModal;
