import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import WorkoutScreen from "./WorkoutScreen";
import { fitnessApi } from "../../api/fitnessService";
import { logNewWorkout } from "../../store/slices/workoutSlice";
import {
  DASHBOARD_SCREEN,
  NUTRIENTS_SCREEN,
  PROFILE_SCREEN,
} from "../../navigation/routes";

// 1. Mock React Redux State Architecture
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: {
        colors: {
          background: "#111",
          surface: "#222",
          text: "#fff",
          primary: "#00F",
          textSecondary: "#888",
          textOnPrimary: "#000",
        },
      },
      auth: { user: { id: "usr-123" } },
    }),
  ),
}));

// 2. Mock Axios Endpoint Framework Instance
jest.mock("../../api/fitnessService", () => ({
  fitnessApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// 3. Mock Workout Action Slices
jest.mock("../../store/slices/workoutSlice", () => ({
  logNewWorkout: jest.fn((p) => ({ type: "LOG_WORKOUT", payload: p })),
}));

// 4. Mock Global Alert Window
global.alert = jest.fn();

describe("WorkoutScreen Integration Tests", () => {
  const mockNavigation = { navigate: jest.fn() };

  const mockWorkoutsData = {
    data: [
      {
        id: "w-1",
        name: "Cardio Blast",
        description: "High intensity cardio",
        duration: 30,
        calories: 300,
        targetGoal: "Endurance",
        level: "Intermediate",
      },
      {
        id: "w-2",
        name: "Yoga Flow",
        description: "Relaxing yoga poses",
        duration: 45,
        calories: 150,
        targetGoal: "Flexibility",
        level: "Beginner",
      },
    ],
  };

  const mockHistoryData = {
    data: [
      { id: "h-1", userId: "usr-123", workoutId: "w-2", date: "2026-07-06" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    fitnessApi.get.mockImplementation((url) => {
      if (url === "/workouts") return Promise.resolve(mockWorkoutsData);
      if (url === "/workoutHistory") return Promise.resolve(mockHistoryData);
      return Promise.reject(new Error("Unknown URL path"));
    });

    fitnessApi.post.mockResolvedValue({
      data: { id: "h-new", workoutId: "w-1" },
    });
  });

  it("fetches workflows on mount and loads items correctly into lists", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(fitnessApi.get).toHaveBeenCalledWith("/workouts");
    });

    expect(screen.getByText("Cardio Blast")).toBeTruthy();
    expect(screen.getByText("Yoga Flow")).toBeTruthy();

    // Fix: Assert text arrays based on the verified live layout dump matrix safely
    expect(screen.getAllByText("Start Workout").length).toBe(2);
  });

  it("filters workouts dynamically through text search queries input", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText("Search workout...");
    await fireEvent.changeText(searchInput, "Yoga");

    expect(screen.getByText("Yoga Flow")).toBeTruthy();
    expect(screen.queryByText("Cardio Blast")).toBeNull();
  });

  it("filters items correctly via target experience levels selector tags", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    // Fix: Target the 0th element array element which corresponds to the selector tab bar
    const intermediateButton = screen.getAllByText("Intermediate")[0];
    await fireEvent.press(intermediateButton);

    expect(screen.getByText("Cardio Blast")).toBeTruthy();
    expect(screen.queryByText("Yoga Flow")).toBeNull();
  });

  it("displays Empty Component layout if no search matching records catch hits", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    const searchInput = screen.getByPlaceholderText("Search workout...");
    await fireEvent.changeText(searchInput, "EmptyNonExistentString123");

    expect(screen.getByText("No workouts found.")).toBeTruthy();
  });

  it("applies explicit design token properties from layout styles and theme colors", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    const workoutNameText = screen.getByText("Cardio Blast");
    const descriptionText = screen.getByText("High intensity cardio");

    // Fix: Grab the first text node reference element safely from the array stack
    const startWorkoutText = screen.getAllByText("Start Workout")[0];

    const flatNameStyle = StyleSheet.flatten(workoutNameText.props.style);
    const flatDescStyle = StyleSheet.flatten(descriptionText.props.style);
    const flatBtnTextStyle = StyleSheet.flatten(startWorkoutText.props.style);

    expect(flatNameStyle.color).toBe("#fff");
    expect(flatNameStyle.fontSize).toBe(19);
    expect(flatDescStyle.color).toBe("#888");
    expect(flatBtnTextStyle.color).toBe("#000");
    expect(flatBtnTextStyle.fontSize).toBe(16);
  });

  it("dispatches logNewWorkout, updates server arrays, and updates button titles after starting workouts", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    // Fix: Isolate the exact interactive target node from the multiple instances array
    const startButton = screen.getAllByText("Start Workout")[0];
    await fireEvent.press(startButton);

    await waitFor(() => {
      expect(fitnessApi.post).toHaveBeenCalledWith(
        "/workoutHistory",
        expect.objectContaining({
          userId: "usr-123",
          workoutId: "w-1",
          durationCompleted: 30,
          caloriesBurned: 300,
        }),
      );

      expect(logNewWorkout).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith("Workout Added Successfully!");
    });
  });

  it("handles navigation redirects seamlessly when navigation links are clicked", async () => {
    await render(<WorkoutScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText("Cardio Blast")).toBeTruthy();
    });

    await fireEvent.press(screen.getByText("Dashboard"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(DASHBOARD_SCREEN);

    await fireEvent.press(screen.getByText("Nutrients"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(NUTRIENTS_SCREEN);

    await fireEvent.press(screen.getByText("Profile"));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(PROFILE_SCREEN);
  });
});
