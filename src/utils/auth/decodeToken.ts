import { DecodedToken } from "./types";
import Base64 from "react-native-base64";

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    const base64Payload = token.split(".")[1];
    const normalizedPayload = base64Payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = Base64.decode(normalizedPayload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
