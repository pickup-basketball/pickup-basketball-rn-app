import { DecodedToken } from "./types";
import Base64 from "react-native-base64";

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token || token.split(".").length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    const base64Url = token.split(".")[1];
    const base64 =
      base64Url.replace(/-/g, "+").replace(/_/g, "/") +
      Array(4 - (base64Url.length % 4))
        .fill("=")
        .join("");

    const jsonPayload = decodeURIComponent(
      Base64.decode(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
