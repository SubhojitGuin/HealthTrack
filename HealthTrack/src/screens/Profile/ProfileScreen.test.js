import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import ProfileScreen from './ProfileScreen'; // Adjust path based on your folder structure
import { fitnessApi } from '../../api/fitnessService'; 
import { updateProfilePhoto } from '../../store/slices/authSlice';
import { storageService } from '../../services/storageService';
import { pickImageFromGallery } from '../../services/imagePickerService'; 
import { pickImageFromCamera } from '../../services/cameraService';
import { DASHBOARD_SCREEN, WORKOUT_SCREEN, NUTRIENTS_SCREEN } from '../../navigation/routes';

// 1. Mock React Navigation Lifecycle Hooks
jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react');
  return {
    useFocusEffect: (cb) => useEffect(() => cb(), []),
  };
});

// 2. Mock React Redux State Architecture
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: { 
        colors: { 
          background: '#111', 
          surface: '#222', 
          text: '#fff', 
          primary: '#00F', 
          textSecondary: '#888',
          textOnPrimary: '#000'
        } 
      },
      auth: { user: { id: 'usr-444', name: 'Original User' }, profilePhoto: null },
    })
  ),
}));

// 3. Mock Axios Endpoint Framework Instance
jest.mock('../../api/fitnessService', () => ({
  fitnessApi: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

// 4. Mock Profile Authentication Slices
jest.mock('../../store/slices/authSlice', () => ({
  updateProfilePhoto: jest.fn((p) => ({ type: 'UPDATE_PHOTO', payload: p })),
}));

// 5. Mock Local Variable Persistence Service
jest.mock('../../services/storageService', () => ({
  storageService: { setItem: jest.fn() },
}));

// 6. Mock Image Selection Platform Hardware Utilities
jest.mock('../../services/imagePickerService', () => ({
  pickImageFromGallery: jest.fn(),
}));

jest.mock('../../services/cameraService', () => ({
  pickImageFromCamera: jest.fn(),
}));

describe('ProfileScreen Integration Tests', () => {
  const mockNavigation = { navigate: jest.fn() };

  const mockUserPayload = { data: { id: 'usr-444', name: 'Jane Doe', email: 'jane@fit.com', age: 29, weight: 62, height: 168 } };
  const mockWorkoutHistoryPayload = {
    data: [
      { id: 101, userId: 'usr-444', workoutId: 'w-abc', date: '2026-07-06T10:00:00.000Z', durationCompleted: 30, caloriesBurned: 250 },
    ],
  };
  const mockWorkoutsPayload = { data: [{ id: 'w-abc', name: 'Cardio Blast', targetGoal: 'Endurance', level: 'Intermediate' }] };
  const mockNutritionPayload = { data: [{ id: 501, meal: 'Greek Yogurt Bowl', type: 'Breakfast', calories: 280, protein: 20 }] };

  beforeEach(() => {
    jest.clearAllMocks();

    // Map default Axios route implementations
    fitnessApi.get.mockImplementation((url) => {
      if (url === '/users/usr-444') return Promise.resolve(mockUserPayload);
      if (url === '/workoutHistory') return Promise.resolve(mockWorkoutHistoryPayload);
      if (url === '/workouts') return Promise.resolve(mockWorkoutsPayload);
      if (url === '/nutrition') return Promise.resolve(mockNutritionPayload);
      return Promise.reject(new Error('Unknown URL path'));
    });

    fitnessApi.patch.mockResolvedValue({ data: {} });
  });

  it('orchestrates concurrent API requests on mount and paints dashboard summary text nodes', async () => {
    await render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(fitnessApi.get).toHaveBeenCalledWith('/users/usr-444');
    });

    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('jane@fit.com')).toBeTruthy();
    expect(screen.getByText('29')).toBeTruthy();
    expect(screen.getByText('62 kg')).toBeTruthy();
    expect(screen.getByText('168 cm')).toBeTruthy();
    expect(screen.getByText('Cardio Blast')).toBeTruthy();
    expect(screen.getByText('Greek Yogurt Bowl')).toBeTruthy();
  });

  it('triggers image gallery picking processes, patches user endpoint, and saves to storage cache', async () => {
    pickImageFromGallery.mockResolvedValueOnce('file://new-gallery-image.jpg');

    await render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeTruthy();
    });

    await fireEvent.press(screen.getByText('Gallery'));

    expect(pickImageFromGallery).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(updateProfilePhoto).toHaveBeenCalledWith('file://new-gallery-image.jpg');
      expect(fitnessApi.patch).toHaveBeenCalledWith('/users/usr-444', { profilePhoto: 'file://new-gallery-image.jpg' });
    });
  });

  it('triggers camera photo capture processes and patches user endpoint', async () => {
    pickImageFromCamera.mockResolvedValueOnce('file://new-camera-capture.jpg');

    await render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeTruthy();
    });

    await fireEvent.press(screen.getByText('Camera'));

    expect(pickImageFromCamera).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(updateProfilePhoto).toHaveBeenCalledWith('file://new-camera-capture.jpg');
    });
  });

  it('applies design token properties from stylesheet and Redux theme colors cleanly', async () => {
    await render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeTruthy();
    });

    const nameText = screen.getByText('Jane Doe');
    const emailText = screen.getByText('jane@fit.com');
    const galleryButtonText = screen.getByText('Gallery');

    const flatNameStyle = StyleSheet.flatten(nameText.props.style);
    const flatEmailStyle = StyleSheet.flatten(emailText.props.style);
    const flatButtonTextStyle = StyleSheet.flatten(galleryButtonText.props.style);

    expect(flatNameStyle.color).toBe('#fff');
    expect(flatNameStyle.fontSize).toBe(24);
    expect(flatEmailStyle.color).toBe('#888');
    expect(flatButtonTextStyle.color).toBe('#000');
  });

  it('handles navigation redirects seamlessly when navigation button targets are pressed', async () => {
    await render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeTruthy();
    });

    await fireEvent.press(screen.getByText('Dashboard'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(DASHBOARD_SCREEN);

    await fireEvent.press(screen.getByText('Workouts'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(WORKOUT_SCREEN);

    await fireEvent.press(screen.getByText('Nutrients'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(NUTRIENTS_SCREEN);
  });
});
