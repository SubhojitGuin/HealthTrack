import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { fitnessApi } from "../../api/fitnessService";
import { useFocusEffect } from "@react-navigation/native";

import {
  pickImageFromGallery,
} from "../../services/imagePickerService";

import {
  pickImageFromCamera,
} from "../../services/cameraService";

import {
  updateProfilePhoto,
  addProgressPhoto,
} from "../../store/slices/authSlice";

import {
  DASHBOARD_SCREEN,
  WORKOUT_SCREEN,
  NUTRIENTS_SCREEN,
} from "../../navigation/routes";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const { user, profilePhoto } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({});
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [nutritionHistory, setNutritionHistory] = useState([]);

  const [workoutCount, setWorkoutCount] = useState(0);
  const [lastActive, setLastActive] = useState("--");

  const getProfileData = async () => {
    try {
      const [userRes, historyRes, workoutRes] = await Promise.all([
        fitnessApi.get(`/users/${user.id}`),
        fitnessApi.get("/workoutHistory"), // ✅ FIXED (removed query param)
        fitnessApi.get("/workouts"),
      ]);

      setUserData(userRes.data);

      const userHistory = (historyRes.data || []).filter(
        (item) => item.userId === String(user.id),
      );

      const historyWithWorkout = userHistory.map((history) => {
        const workout = workoutRes.data.find(
          (item) => item.id === history.workoutId,
        );

        return {
          ...history,
          workout,
        };
      });

      setWorkoutHistory(historyWithWorkout);
      setWorkoutCount(historyWithWorkout.length);

      const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString() : "--";

      setLastActive(
        historyWithWorkout.length > 0
          ? formatDate(historyWithWorkout[0].date)
          : "--",
      );
    } catch (error) {
      console.log("Profile Error:", error);
    }
  };

  const getNutritionHistory = async () => {
    try {
      const response = await fitnessApi.get("/nutrition");
      setNutritionHistory(response.data.slice(0, 4));
    } catch (error) {
      console.log("Nutrition Error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProfileData();
      getNutritionHistory();
    }, []),
  );

  const pickImage = async () => {
    try {
      const imageUri = await pickImageFromGallery();

      if (imageUri) {
        dispatch(updateProfilePhoto(imageUri));

        await fitnessApi.patch(`/users/${user.id}`, {
          profilePhoto: imageUri,
        });

        getProfileData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takePhoto = async () => {
    try {
      const imageUri = await pickImageFromCamera();

      if (imageUri) {
        dispatch(addProgressPhoto(imageUri));

        await fitnessApi.patch(`/users/${user.id}`, {
          progressPhotos: [...(user.progressPhotos || []), imageUri],
        });

        getProfileData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              profilePhoto ||
              userData.profilePhoto ||
              "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
            <Text style={styles.imageBtnText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.age}</Text>
          <Text style={styles.statTitle}>Age</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.weight} kg</Text>
          <Text style={styles.statTitle}>Weight</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userData.height} cm</Text>
          <Text style={styles.statTitle}>Height</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryHeading}>Workout Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryTitle}>Total Workouts</Text>
          <Text style={styles.summaryValue}>{workoutCount}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryTitle}>Last Active</Text>
          <Text style={styles.summaryValue}>{lastActive}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Workout History</Text>

      <FlatList
        data={workoutHistory}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text>No workout history yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>
              {item.workout?.name || "Workout"}
            </Text>

            <Text style={styles.historyText}>📅 {item.date}</Text>
            <Text style={styles.historyText}>
              ⏱ {item.durationCompleted} mins
            </Text>
            <Text style={styles.historyText}>
              🔥 {item.caloriesBurned} kcal
            </Text>
            <Text style={styles.historyText}>
              🎯 {item.workout?.targetGoal || "-"}
            </Text>
            <Text style={styles.historyText}>
              💪 {item.workout?.level || "-"}
            </Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Nutrition</Text>

      <FlatList
        data={nutritionHistory}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>{item.meal}</Text>
            <Text style={styles.historyText}>🍽 {item.type}</Text>
            <Text style={styles.historyText}>🔥 {item.calories} kcal</Text>
            <Text style={styles.historyText}>💪 Protein: {item.protein} g</Text>
          </View>
        )}
      />

      <View style={styles.navigationCard}>
        <Text style={styles.summaryHeading}>Quick Navigation</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate(DASHBOARD_SCREEN)}
        >
          <Text style={styles.navButtonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate(WORKOUT_SCREEN)}
        >
          <Text style={styles.navButtonText}>Workouts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate(NUTRIENTS_SCREEN)}
        >
          <Text style={styles.navButtonText}>Nutrients</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    alignItems: "center",
    padding: 25,
    elevation: 4,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#4F8EF7",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  imageBtn: {
    backgroundColor: "#4F8EF7",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 8,
  },

  imageBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    color: "#777",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F8EF7",
  },

  statTitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },

  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  summaryHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#222",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  summaryTitle: {
    fontSize: 16,
    color: "#666",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 15,
    color: "#222",
  },

  historyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },

  historyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },

  historyText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 5,
  },

  navigationCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  navButton: {
    backgroundColor: "#4F8EF7",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
