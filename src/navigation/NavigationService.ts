import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName] // ✅ params 타입 체크
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(
      name as never, // ✅ 타입 단언
      params !== undefined ? (params as never) : undefined
    );
  }
}
