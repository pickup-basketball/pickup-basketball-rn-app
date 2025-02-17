import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeToken } from "./decodeToken";

export const getCurrentUserId = async (): Promise<number | null> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded?.userId ?? null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export * from "./decodeToken";
export * from "./types";
