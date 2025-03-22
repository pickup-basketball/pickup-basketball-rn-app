import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { colors } from "../../../src/styles/colors";
import EditMatchScreen from "../../../src/components/match/EditMatchScreen";
import { useEditMatchStore } from "../../../src/utils/store/editMatchStore";

export default function EditMatchPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const matchId = typeof id === "string" ? id : "";

  // 스토어에서 매치 데이터와 초기화 함수 가져오기
  const { matchData, clearMatchData } = useEditMatchStore();

  // 컴포넌트 언마운트 시 스토어 데이터 정리
  useEffect(() => {
    return () => {
      clearMatchData();
    };
  }, [clearMatchData]);

  // 데이터가 없으면 에러 표시 또는 이전 페이지로 돌아가기
  if (!matchData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.error }}>
          매치 정보를 찾을 수 없습니다
        </Text>
        <Text
          style={{ color: colors.white, marginTop: 10 }}
          onPress={() => router.back()}
        >
          이전 페이지로 돌아가기
        </Text>
      </View>
    );
  }

  // 매치 수정 컴포넌트 렌더링
  return <EditMatchScreen matchData={matchData} matchId={matchId} />;
}
