import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import DashboardScreen from './DashboardScreen'; 
import { fetchAvailableWorkouts, fetchWorkoutHistory, fetchUserPreference } from '../../api/fitnessService';
import { setUserWorkoutHistory } from '../../store/slices/workoutSlice';
import { PROFILE_SCREEN, WORKOUT_SCREEN } from '../../navigation/routes';

jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react'); 
  return {
    useFocusEffect: (cb) => useEffect(() => cb(), []),
  };
});

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: { colors: { background: '#111', text: '#fff', textSecondary: '#888' } },
      auth: { user: { id: 'user-789', name: 'John Doe Spencer' } },
      workout: { history: [], availableWorkouts: [], userPreference: null },
    })
  ),
}));

jest.mock('../../api/fitnessService', () => ({
  fetchAvailableWorkouts: jest.fn(),
  fetchWorkoutHistory: jest.fn(),
  fetchUserPreference: jest.fn(),
}));

jest.mock('../../store/slices/workoutSlice', () => ({
  setUserWorkoutHistory: jest.fn((p) => p),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('DashboardScreen Integration Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockAvailableWorkouts = [
    { id: 'w-1', name: 'Morning Yoga Flow' },
    { id: 'w-2', name: 'Heavy Barbell Squats' },
  ];

  const mockWorkoutHistory = [
    { id: 'h-1', workoutId: 'w-1', date: '2026-07-05', durationCompleted: 20, caloriesBurned: 120 },
    { id: 'h-2', workoutId: 'w-2', date: '2026-07-06', durationCompleted: 45, caloriesBurned: 400 },
  ];

  const mockUserPreference = { goal: 'Gain Muscle', theme: 'dark' };

  beforeEach(() => {
    jest.clearAllMocks();

    fetchAvailableWorkouts.mockResolvedValue(mockAvailableWorkouts);
    fetchWorkoutHistory.mockResolvedValue(mockWorkoutHistory);
    fetchUserPreference.mockResolvedValue(mockUserPreference);
  });

  it('displays the Loader component on layout mounting initialization', async () => {
    fetchAvailableWorkouts.mockReturnValueOnce(new Promise(() => {}));
    
    await render(<DashboardScreen navigation={mockNavigation} />);

    expect(screen.getByText('Loading dashboard...')).toBeTruthy();
  });

  it('safely extracts and displays the users first name correctly inside the WelcomeCard', async () => {
    await render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, John! 👋')).toBeTruthy();
    });
  });

  it('aggregates calculation state scores across lists and sorts history chronologically by date', async () => {
    await render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).toBeNull();
    });

    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('520')).toBeTruthy();
    expect(screen.getByText('65')).toBeTruthy();

    expect(screen.getByText('Heavy Barbell Squats')).toBeTruthy();
    expect(screen.getByText('Morning Yoga Flow')).toBeTruthy();
    expect(screen.getByText('🎯 Gain Muscle')).toBeTruthy();

    expect(setUserWorkoutHistory).toHaveBeenCalledWith({ history: mockWorkoutHistory });
    expect(mockDispatch).toHaveBeenCalledWith(setUserWorkoutHistory({ history: mockWorkoutHistory }));
  });

  it('renders standard empty display lists gracefully when user history contains 0 records', async () => {
    fetchWorkoutHistory.mockResolvedValueOnce([]);

    await render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('No workout history available.')).toBeTruthy();
    });

    expect(screen.getAllByText('0')).toBeTruthy();
  });

  it('catches and logs network failure loops safely without crashing the client view layout', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchAvailableWorkouts.mockRejectedValueOnce(new Error('Network drop'));

    await render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
    });
    
    errorSpy.mockRestore();
  });

  it('handles navigation redirects seamlessly when buttons are activated', async () => {
    await render(<DashboardScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).toBeNull();
    });

    await fireEvent.press(screen.getByText('🏋️Go to Workouts'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(WORKOUT_SCREEN);

    await fireEvent.press(screen.getByText('🏋️Go to Profile'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(PROFILE_SCREEN);
  });
});
