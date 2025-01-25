import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { ViewStyle, TextStyle } from "react-native";

type TGradientWithBoxProps = {
  icon?: React.ReactNode;
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

const GradientWithBox = ({
  icon,
  text,
  style,
  textStyle,
}: TGradientWithBoxProps) => (
  <LinearGradient
    colors={["#FF8800", "#FF00B2"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[
      {
        width: "100%",
        padding: 15,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      },
      style,
    ]}
  >
    {icon}
    <Text
      style={[{ color: "#FFF", fontWeight: "bold", fontSize: 16 }, textStyle]}
    >
      {text}
    </Text>
  </LinearGradient>
);

type TGradientPoint = {
  x: number;
  y: number;
};
type TGradientTextProps = {
  text: string;
  style?: any;
  start?: TGradientPoint;
  end?: TGradientPoint;
};

const GradientText = ({ text, style, start, end }: TGradientTextProps) => (
  <MaskedView
    maskElement={<Text style={[{ fontWeight: "bold" }, style]}>{text}</Text>}
  >
    <LinearGradient
      colors={["#FF8800", "#FF00B2"]}
      start={{ x: 0, y: 6 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[{ opacity: 0 }, style]}>{text}</Text>
    </LinearGradient>
  </MaskedView>
);

export { GradientWithBox, GradientText };
