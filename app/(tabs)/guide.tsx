import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import LoggedInHeader from "../../src/components/common/LoggedInHeader";
import {
  ContactSection,
  DetailGuide,
  FaqSection,
  GuideHeader,
  QuickGuide,
} from "../../src/components/main/GuidItem";
import { colors } from "../../src/styles/colors";

const GuideScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
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
