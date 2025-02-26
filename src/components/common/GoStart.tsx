import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../screens/auth/SignupScreen";

const GoStartButton = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity>
      <View>
        <Text
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Start")}
        >
          startScreen
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default GoStartButton;

const styles = StyleSheet.create({
  buttonContainer: {
    color: "red",
  },
});
