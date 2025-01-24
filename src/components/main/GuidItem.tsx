import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserPlus, MapPin, ChevronDown } from "lucide-react-native";
import React from "react";

const GuideHeader = () => {
  return (
    <View style={styles.headerSection}>
      <View style={styles.headerContent}>
        <Text style={styles.mainTitle}>PICKUP 이용가이드</Text>
        <Text style={styles.subtitle}>
          PICKUP과 함께 새로운 농구 파트너를 찾아보세요.{"\n"}
          간단한 단계를 따라 시작할 수 있습니다.
        </Text>
      </View>
    </View>
  );
};

const QuickGuide = () => {
  return (
    <View style={styles.quickGuideSection}>
      <Text style={styles.sectionTitle}>시작하기</Text>
      <View style={styles.guideCards}>
        <View style={styles.guideCard}>
          <View style={styles.iconContainer}>
            <UserPlus size={24} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>1. 프로필 만들기</Text>
          <Text style={styles.cardDescription}>
            간단한 회원가입 후, 나의 포지션과 실력을 설정하세요.
          </Text>
        </View>
        <View style={styles.guideCard}>
          <View style={styles.iconContainer}>
            <MapPin size={24} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>2. 코트 찾기</Text>
          <Text style={styles.cardDescription}>
            내 주변의 농구장을 찾고 실시간 현황을 확인하세요.
          </Text>
        </View>
        <View style={styles.guideCard}>
          <View style={styles.iconContainer}>
            <UserPlus size={24} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>3. 매칭 참여</Text>
          <Text style={styles.cardDescription}>
            원하는 시간과 장소의 매칭에 참여하거나 직접 모집해보세요.
          </Text>
        </View>
      </View>
    </View>
  );
};
type GuideAccordionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};
const GuideAccordion = ({
  title,
  description,
  children,
}: GuideAccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.accordionButton}
      >
        <View>
          <Text style={styles.accordionTitle}>{title}</Text>
          <Text style={styles.accordionDescription}>{description}</Text>
        </View>
        <ChevronDown
          size={24}
          color="#9CA3AF"
          style={[styles.chevron, isOpen && styles.chevronRotate]}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};
const DetailGuide = () => {
  return (
    <View style={[styles.faqSection, styles.darkSection]}>
      <Text style={styles.sectionTitle}>상세 가이드</Text>
      <GuideAccordion
        title="프로필 설정하기"
        description="나의 농구 스타일을 표현해보세요."
      >
        <Text style={styles.accordionText}>
          • 기본 정보 입력: 키, 몸무게 등 농구에 필요한 정보를 입력하세요.
        </Text>
        <Text style={styles.accordionText}>
          • 포지션 설정: 주 포지션과 서브 포지션을 설정할 수 있습니다.
        </Text>
        <Text style={styles.accordionText}>
          • 실력 수준: 자신의 실력을 객관적으로 평가하여 설정해주세요.
        </Text>
        <Text style={styles.accordionText}>
          • 플레이 스타일: 선호하는 플레이 스타일을 태그로 추가할 수 있습니다.
        </Text>
      </GuideAccordion>
      <GuideAccordion
        title="매칭 참여하기"
        description="다양한 방식으로 게임에 참여해보세요."
      >
        <Text style={styles.accordionText}>
          • 매칭 검색: 지역, 시간, 실력대 등을 기준으로 원하는 매칭을
          찾아보세요.
        </Text>
        <Text style={styles.accordionText}>
          • 매칭 생성: 직접 매칭을 만들고 팀원을 모집할 수 있습니다.
        </Text>
        <Text style={styles.accordionText}>
          • 팀 매칭: 팀 단위로 다른 팀과의 매칭을 진행할 수 있습니다.
        </Text>
      </GuideAccordion>
      <GuideAccordion
        title="매너 평가 시스템"
        description="건전한 매칭 문화를 만들어갑니다."
      >
        <Text style={styles.accordionText}>
          • 매너 점수: 매칭 후 서로에 대한 매너 평가를 진행합니다.
        </Text>
        <Text style={styles.accordionText}>
          • 신고 기능: 비매너 행위는 신고할 수 있습니다.
        </Text>
        <Text style={styles.accordionText}>
          • 제재 정책: 지속적인 비매너 행위는 서비스 이용이 제한될 수 있습니다.
        </Text>
      </GuideAccordion>
    </View>
  );
};
const FaqSection = () => {
  return (
    <View style={styles.faqSection}>
      <Text style={styles.sectionTitle}> 자주 묻는 질문</Text>
      <GuideAccordion
        title="서비스 이용은 무료인가요?"
        description="비용 관련 안내"
      >
        <Text style={styles.accordionText}>
          네, PICKUP의 모든 기본 기능은 무료로 이용하실 수 있습니다. 매칭 참여,
          팀 찾기, 코트 정보 확인 등 모든 서비스를 제한 없이 이용해보세요.
        </Text>
      </GuideAccordion>
      <GuideAccordion
        title="매칭 취소는 어떻게 하나요?"
        description="매칭 취소 정책 안내"
      >
        <Text style={styles.accordionText}>
          • 매칭 시작 24시간 전까지: 자유롭게 취소 가능
        </Text>
        <Text style={styles.accordionText}>
          • 매칭 시작 24시간 이내: 매너 점수에 영향을 줄 수 있음
        </Text>
        <Text style={styles.accordionText}>• 당일 취소: 매너 점수 차감</Text>
      </GuideAccordion>
      <GuideAccordion
        title="실력 인증은 어떻게 하나요?"
        description="실력 인증 시스템 안내"
      >
        <Text style={styles.accordionText}>
          • 영상 인증: 자신의 플레이 영상을 업로드
        </Text>
        <Text style={styles.accordionText}>
          • 매칭 평가: 매칭 후 서로의 실력을 평가
        </Text>
        <Text style={styles.accordionText}>
          • 공식 인증: PICKUP 공식 이벤트 참여를 통한 인증
        </Text>
      </GuideAccordion>
    </View>
  );
};

const ContactSection = () => {
  return (
    <View style={styles.contactSection}>
      <Text style={styles.sectionTitle}>더 궁금한 점이 있으신가요?</Text>
      <Text style={styles.contactDescription}>
        언제든 문의해주세요. 신속하게 답변해드리겠습니다.
      </Text>
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>문의하기</Text>
      </TouchableOpacity>
    </View>
  );
};
export { GuideHeader, QuickGuide, DetailGuide, FaqSection, ContactSection };

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: "#18181B",
    padding: 20,
    paddingTop: 80,
    paddingBottom: 80,
  },
  headerContent: {
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 24,
  },
  quickGuideSection: {
    marginBottom: 50,
    padding: 20,
  },
  faqSection: {
    padding: 20,
    backgroundColor: "#000",
    paddingBottom: 70,
  },
  darkSection: {
    backgroundColor: "#18181B",
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  guideCards: {
    gap: 16,
  },
  guideCard: {
    backgroundColor: "#18181B",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#F97316",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  cardDescription: {
    color: "#9CA3AF",
    lineHeight: 20,
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  accordionButton: {
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  accordionDescription: {
    color: "#9CA3AF",
  },
  accordionContent: {
    paddingBottom: 24,
  },
  accordionText: {
    color: "#9CA3AF",
    lineHeight: 20,
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronRotate: {
    transform: [{ rotate: "180deg" }],
  },
  contactSection: {
    backgroundColor: "#18181B",
    alignItems: "center",
    paddingBottom: 50,
  },
  contactDescription: {
    color: "#9CA3AF",
    marginBottom: 20,
    textAlign: "center",
  },
  contactButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  contactButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
