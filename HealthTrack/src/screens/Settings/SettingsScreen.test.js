import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import SettingsScreen from './SettingsScreen';
import { updateUserPreferences } from '../../api/fitnessService';
import { setUserPreferences } from '../../store/slices/workoutSlice';
import { setTheme } from '../../store/slices/themeSlice';
import { storageService } from '../../services/storageService';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: {
        mode: 'light',
        colors: { background: '#FFF', card: '#F5F5F5', text: '#000', textSecondary: '#666', border: '#CCC', shadow: '#000' },
      },
      auth: {
        user: { name: 'Alex Cooper', email: 'alex@healthtrack.com', age: 28 },
      },
      workout: {
        userPreferences: { id: 'pref-456', notificationsEnabled: true, goal: 'Muscle Gain' },
      },
    })
  ),
}));

jest.mock('../../api/fitnessService', () => ({
  updateUserPreferences: jest.fn(),
}));

jest.mock('../../store/slices/workoutSlice', () => ({
  setUserPreferences: jest.fn((p) => p),
}));
jest.mock('../../store/slices/themeSlice', () => ({
  setTheme: jest.fn((p) => p),
}));

jest.mock('../../services/storageService', () => ({
  storageService: { saveUserPreferences: jest.fn() },
}));

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockPicker = ({ children, selectedValue, onValueChange, ...props }) => {
    return (
      <View testID="mock-picker" selectedValue={selectedValue} onValueChange={onValueChange} {...props}>
        {children}
      </View>
    );
  };
  
  const MockPickerItem = (props) => <View testID="mock-picker-item" {...props} />;
  
  MockPicker.Item = MockPickerItem;
  return { Picker: MockPicker };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('SettingsScreen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile metadata info card and application data states properly', async () => {
    await render(<SettingsScreen />);

    expect(screen.getByText('Name: Alex Cooper')).toBeTruthy();
    expect(screen.getByText('Email: alex@healthtrack.com')).toBeTruthy();
    expect(screen.getByText('Age: 28')).toBeTruthy();

    expect(screen.getByText('Weight: kg')).toBeTruthy();
    expect(screen.getByText('HealthTrack v1.0.0')).toBeTruthy();
  });

  it('handles toggling notifications switch settings state flawlessly', async () => {
    await render(<SettingsScreen />);

    const switches = screen.getAllByRole('switch');
    const notificationSwitch = switches[0];

    await fireEvent(notificationSwitch, 'valueChange', false);

    const expectedNewPreferences = { id: 'pref-456', notificationsEnabled: false, goal: 'Muscle Gain' };

    expect(updateUserPreferences).toHaveBeenCalledWith('pref-456', expectedNewPreferences);
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: expectedNewPreferences });
    expect(mockDispatch).toHaveBeenCalledWith(setUserPreferences({ preferences: expectedNewPreferences }));
    expect(storageService.saveUserPreferences).toHaveBeenCalledWith(expectedNewPreferences);
  });

  it('handles changing dark mode switch settings state and updates app theme mode configuration', async () => {
    await render(<SettingsScreen />);

    const switches = screen.getAllByRole('switch');
    const darkModeSwitch = switches[1];

    await fireEvent(darkModeSwitch, 'valueChange', true);

    const expectedNewPreferences = { id: 'pref-456', notificationsEnabled: true, goal: 'Muscle Gain', theme: 'dark' };

    expect(updateUserPreferences).toHaveBeenCalledWith('pref-456', expectedNewPreferences);
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: expectedNewPreferences });
    expect(setTheme).toHaveBeenCalledWith({ mode: 'dark' });
    expect(mockDispatch).toHaveBeenCalledWith(setTheme({ mode: 'dark' }));
    expect(storageService.saveUserPreferences).toHaveBeenCalledWith(expectedNewPreferences);
  });

  it('handles picking a new fitness target from the Goal Picker component stream', async () => {
    await render(<SettingsScreen />);

    const pickerElement = screen.getByTestId('mock-picker');

    await fireEvent(pickerElement, 'valueChange', 'Weight Loss');

    const expectedNewPreferences = { id: 'pref-456', notificationsEnabled: true, goal: 'Weight Loss' };

    expect(updateUserPreferences).toHaveBeenCalledWith('pref-456', expectedNewPreferences);
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: expectedNewPreferences });
    expect(mockDispatch).toHaveBeenCalledWith(setUserPreferences({ preferences: expectedNewPreferences }));
    expect(storageService.saveUserPreferences).toHaveBeenCalledWith(expectedNewPreferences);
  });
});
