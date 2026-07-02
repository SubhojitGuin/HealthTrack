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

export default function WorkoutScreen() {
  const { user } = useSelector((state) => state.auth);

  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // ✅ NEW STATE (tracks clicked workouts)
  const [startedWorkouts, setStartedWorkouts] = useState([]);

  const dispatch = useDispatch();

  const startWorkout = async (workout) => {
    try {
      const history = {
        userId: String(user.id),
        workoutId: workout.id,
        date: new Date().toISOString().split("T")[0],
        durationCompleted: workout.duration,
        caloriesBurned: workout.calories,
      };

      const response = await fitnessApi.post("/workoutHistory", history);

      dispatch(logNewWorkout(response.data));

      // ✅ mark as added
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
      {/* Header */}
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
            {/* Search */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search workout..."
                value={search}
                onChangeText={searchWorkout}
              />
            </View>

            {/* Filters */}
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

              {/* ✅ BUTTON LOGIC UPDATED */}
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
      />
    </View>
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
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },

  activeFilterButton: {
    backgroundColor: "#4F8EF7",
  },

  filterText: {
    color: "#555",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#fff",
  },

  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },

  workoutName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },

  description: {
    color: "#666",
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
    color: "#555",
    fontSize: 15,
  },

  goal: {
    color: "#4F8EF7",
    fontWeight: "600",
    fontSize: 14,
  },

  levelBadge: {
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  levelText: {
    color: "#4F8EF7",
    fontWeight: "700",
    fontSize: 13,
  },

  startButton: {
    marginTop: 8,
    backgroundColor: "#4F8EF7",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 14,
  },

  startButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
