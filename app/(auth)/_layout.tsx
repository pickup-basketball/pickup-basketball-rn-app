import { Stack, usePathname } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "../../src/components/common/Header";

export default function AuthLayout() {
  const pathname = usePathname();
  const isStartScreen = pathname.endsWith("/start");

  return (
    <SafeAreaView style={styles.container}>
      {!isStartScreen && <Header />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="start" />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
  },
});
