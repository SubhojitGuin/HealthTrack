import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About HealthTrack</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🏋️ HealthTrack</Text>

        <Text style={styles.description}>
          HealthTrack is a personal fitness and wellness application that helps
          users manage their daily workouts, nutrition, and health progress in
          one place.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✨ Features</Text>

        <Text style={styles.feature}>• User Registration & Login</Text>
        <Text style={styles.feature}>• Personalized Dashboard</Text>
        <Text style={styles.feature}>• Workout Tracking</Text>
        <Text style={styles.feature}>• Nutrition Monitoring</Text>
        <Text style={styles.feature}>• Profile & Progress Photos</Text>
        <Text style={styles.feature}>• Search & Filter Workouts</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎯 Our Mission</Text>

        <Text style={styles.description}>
          Our mission is to encourage a healthy lifestyle by making fitness
          tracking simple, organized, and motivating for everyone.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📱 App Information</Text>

        <Text style={styles.info}>Version : 1.0.0</Text>
        <Text style={styles.info}>Platform : React Native (Expo)</Text>
        <Text style={styles.info}>Backend : JSON Server</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for Health & Fitness</Text>
        <Text style={styles.footerText}>
          © 2026 HealthTrack. All Rights Reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#fff",
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4F8EF7",
    marginBottom: 12,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
  },

  feature: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  footer: {
    alignItems: "center",
    marginVertical: 30,
  },

  footerText: {
    color: "#777",
    fontSize: 14,
    marginBottom: 5,
  },
});
