import LoggedInHeader from "../../components/common/LoggedInHeader";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
  GuideHeader,
  QuickGuide,
  DetailGuide,
  FaqSection,
  ContactSection,
} from "../../components/main/GuidItem";
import { colors } from "../../styles/colors";

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
    backgroundColor: colors.background,
  },
});

export default GuideScreen;
