import LoggedInHeader from "../../components/common/LoggedInHeader";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import {
  GuideHeader,
  QuickGuide,
  DetailGuide,
  FaqSection,
  ContactSection,
} from "../../components/main/GuidItem";
import { colors } from "../../styles/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import PushPermissionModal from "../../components/permission/PushPermissionModal";

const GuideScreen = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    checkPushPermissionShown();
  }, []);

  const checkPushPermissionShown = async () => {
    try {
      const hasShown = await AsyncStorage.getItem("pushPermissionShown");
      if (!hasShown) {
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error("Failed to check push permission status:", error);
    }
  };

  const handleModalClose = async () => {
    try {
      await AsyncStorage.setItem("pushPermissionShown", "true");
      setShowPermissionModal(false);
    } catch (error) {
      console.error("Failed to save push permission status:", error);
    }
  };
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
      <PushPermissionModal
        isVisible={showPermissionModal}
        onClose={handleModalClose}
      />
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
