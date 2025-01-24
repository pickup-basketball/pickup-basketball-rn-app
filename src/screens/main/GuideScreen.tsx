import LoggedInHeader from "../../components/common/LoggedInHeader";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  GuideHeader,
  QuickGuide,
  DetailGuide,
  FaqSection,
  ContactSection,
} from "../../components/main/GuidItem";

const GuideScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
      <ScrollView>
        <GuideHeader />
        <QuickGuide />
        <DetailGuide />
        <FaqSection />
        <ContactSection />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default GuideScreen;
