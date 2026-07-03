import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { fitnessApi } from "../../api/fitnessService";

import { useDispatch, useSelector } from "react-redux";
import { logNewWorkout } from "../../store/slices/workoutSlice";

import Input from "../../components/Input";

import {
  DASHBOARD_SCREEN,
  NUTRIENTS_SCREEN,
  PROFILE_SCREEN,
} from "../../navigation/routes";

export default function WorkoutScreen({ navigation }) {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  const { user } = useSelector((state) => state.auth);

  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const [startedWorkouts, setStartedWorkouts] = useState([]);

  const dispatch = useDispatch();

  const startWorkout = async (workout) => {
    try {
      if (startedWorkouts.includes(workout.id)) {
        return;
      }

      const history = {
        userId: String(user.id),
        workoutId: workout.id,
        date: new Date().toISOString().split("T")[0],
        durationCompleted: workout.duration,
        caloriesBurned: workout.calories,
      };

      const response = await fitnessApi.post("/workoutHistory", history);

      dispatch(logNewWorkout(response.data));

      setStartedWorkouts((prev) => [...prev, workout.id]);

      alert("Workout Added Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkouts = async () => {
    try {
      const response = await fitnessApi.get("/workouts");

      setWorkouts(response.data);
      setFilteredWorkouts(response.data);
    } catch (error) {
      console.log("Workout Error:", error);
    }
  };

  const getWorkoutHistory = async () => {
    try {
      const response = await fitnessApi.get("/workoutHistory", {
        params: {
          userId: String(user.id),
        },
      });

      setStartedWorkouts(response.data.map((item) => item.workoutId));
    } catch (error) {
      console.log("Workout History Error:", error);
    }
  };

  const searchWorkout = (text) => {
    setSearch(text);
    applyFilters(text, selectedLevel);
  };

  const filterWorkout = (level) => {
    setSelectedLevel(level);
    applyFilters(search, level);
  };

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    getWorkouts();
  }, []);

  const applyFilters = (text, level) => {
    let data = [...workouts];

    if (level && level !== "All") {
      data = data.filter((item) => item.level === level);
    }

    if (text && text.trim() !== "") {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
    }

    setFilteredWorkouts(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
      </View>

      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 25,
        }}
        ListHeaderComponent={
          <>
            <Input
              placeholder="Search workout..."
              value={search}
              onChangeText={searchWorkout}
            />
            <FlatList
              data={levels}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              extraData={selectedLevel}
              contentContainerStyle={styles.filterContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    selectedLevel === item && styles.activeFilterButton,
                  ]}
                  onPress={() => filterWorkout(item)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedLevel === item && styles.activeFilterText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        }
        renderItem={({ item }) => {
          const isStarted = startedWorkouts.includes(item.id);

          return (
            <View style={styles.workoutCard}>
              <Text style={styles.workoutName}>{item.name}</Text>

              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoText}>⏱ {item.duration} mins</Text>
                <Text style={styles.infoText}>🔥 {item.calories} kcal</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.goal}>🎯 {item.targetGoal}</Text>

                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.startButton,
                  isStarted && { backgroundColor: "#aaa" },
                ]}
                disabled={isStarted}
                onPress={() => startWorkout(item)}
              >
                <Text style={styles.startButtonText}>
                  {isStarted ? "Added" : "Start Workout"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workouts found.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.navigationCard}>
            <Text style={styles.headerText}>Quick Navigation</Text>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate(DASHBOARD_SCREEN)}
            >
              <Text style={styles.navButtonText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate(NUTRIENTS_SCREEN)}
            >
              <Text style={styles.navButtonText}>Nutrients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate(PROFILE_SCREEN)}
            >
              <Text style={styles.navButtonText}>Profile</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.surface,
    paddingTop: 55,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 3,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 18,
    height: 50,
    fontSize: 16,
    elevation: 2,
  },

  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },

  activeFilterButton: {
    backgroundColor: colors.primary,
  },

  filterText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },

  activeFilterText: {
    color: colors.textOnPrimary,
  },

  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },

  workoutName: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  goal: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  levelBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  levelText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  startButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
  },

  startButtonText: {
    color: colors.textOnPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  navigationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    elevation: 3,
  },

  navButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  navButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 18,
  },
});
