import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignupScreen from './SignupScreen'; // Adjust path based on your folder structure
import { signupUser, addUserPreferences } from '../../api/fitnessService';
import { login } from '../../store/slices/authSlice';
import { setUserPreferences } from '../../store/slices/workoutSlice';
import { setTheme } from '../../store/slices/themeSlice';
import { tokenManager } from '../../utils/tokenManager';
import { storageService } from '../../services/storageService';
import { DRAWER_NAVIGATOR, LOGIN_SCREEN } from '../../navigation/routes';

// 1. Decisively fix the [@RNC/AsyncStorage] NativeModule Null error globally
jest.mock('@react-native-async-storage/async-storage', () => 
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 2. Mock React Redux Hooks Hooks
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: { colors: { text: '#000', textSecondary: '#555', primary: '#00F', border: '#CCC', surface: '#FFF' } },
    })
  ),
}));

// 3. Mock API Service Endpoints
jest.mock('../../api/fitnessService', () => ({
  signupUser: jest.fn(),
  addUserPreferences: jest.fn(),
}));

// 4. Mock Redux Action Slices Slices
jest.mock('../../store/slices/authSlice', () => ({ login: jest.fn((p) => p) }));
jest.mock('../../store/slices/workoutSlice', () => ({ setUserPreferences: jest.fn((p) => p) }));
jest.mock('../../store/slices/themeSlice', () => ({ setTheme: jest.fn((p) => p) }));

// 5. Mock Utility Storage Layers
jest.mock('../../utils/tokenManager', () => ({ tokenManager: { setToken: jest.fn() } }));
jest.mock('../../services/storageService', () => ({
  storageService: { saveUserData: jest.fn(), saveUserPreferences: jest.fn() },
}));

// 6. Mock Native Alert Systems
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SignupScreen Integration Tests', () => {
  const mockNavigation = {
    reset: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getSignupButton = () => screen.getAllByText('Signup')[1]; // Grabs button (index 1) instead of header text (index 0)

  it('renders all form input fields and functional buttons correctly', async () => {
    await render(<SignupScreen navigation={mockNavigation} />);

    expect(screen.getByPlaceholderText('Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Age')).toBeTruthy();
    expect(screen.getByPlaceholderText('Weight')).toBeTruthy();
    expect(screen.getByPlaceholderText('Height')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Go to Login')).toBeTruthy();
  });

  it('displays Formik validation errors if form is submitted blank', async () => {
    await render(<SignupScreen navigation={mockNavigation} />);

    await fireEvent.press(getSignupButton());

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeTruthy();
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });

    expect(signupUser).not.toHaveBeenCalled();
  });

  it('executes successful signup pipelines, updates global states, and routes to drawer workspace', async () => {
    const mockUserResponse = { id: 'user-001', name: 'John Doe', email: 'john@fit.com', token: 'mock_jwt_token_user_001' };
    const mockPrefsResponse = { id: 'pref-001', theme: 'light', goal: 'Weight', notificationsEnabled: true };

    signupUser.mockResolvedValueOnce(mockUserResponse);
    addUserPreferences.mockResolvedValueOnce(mockPrefsResponse);

    await render(<SignupScreen navigation={mockNavigation} />);

    // Populate data entry text blocks
    await fireEvent.changeText(screen.getByPlaceholderText('Name'), 'John Doe');
    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'john@fit.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Age'), '25');
    await fireEvent.changeText(screen.getByPlaceholderText('Weight'), '75');
    await fireEvent.changeText(screen.getByPlaceholderText('Height'), '180');
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'securepassword');

    await fireEvent.press(getSignupButton());

    await waitFor(() => {
      expect(signupUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@fit.com',
        age: 25,
        weight: 75,
        height: 180,
        password: 'securepassword',
        token: 'mock_jwt_token_user_001',
        role: 'user',
        profilePhoto: '',
        progressPhotos: []
      });
      expect(addUserPreferences).toHaveBeenCalledWith({
        userId: 'user-001',
        theme: 'light',
        goal: 'Weight',
        notificationsEnabled: true,
      });
    });

    // Check Redux actions dispatches execution
    expect(login).toHaveBeenCalledWith({ user: mockUserResponse, token: 'mock_jwt_token_user_001' });
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: mockPrefsResponse });
    expect(setTheme).toHaveBeenCalledWith({ mode: 'light' });
    expect(mockDispatch).toHaveBeenCalledTimes(3);

    // Check Local Database Persistent Cache storage storage
    expect(tokenManager.setToken).toHaveBeenCalledWith('mock_jwt_token_user_001');
    expect(storageService.saveUserData).toHaveBeenCalledWith(mockUserResponse);
    expect(storageService.saveUserPreferences).toHaveBeenCalledWith(mockPrefsResponse);

    // Validate navigation reset loop sequence
    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: DRAWER_NAVIGATOR }],
    });
  });

  it('triggers local alert dialog if registration endpoints reject or network throws exceptions', async () => {
    signupUser.mockRejectedValueOnce(new Error('Email already registered'));

    await render(<SignupScreen navigation={mockNavigation} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Name'), 'John Doe');
    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'john@fit.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Age'), '25');
    await fireEvent.changeText(screen.getByPlaceholderText('Weight'), '75');
    await fireEvent.changeText(screen.getByPlaceholderText('Height'), '180');
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'securepassword');

    await fireEvent.press(getSignupButton());

    await waitFor(() => {
      expect(signupUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Signup Failed', 'Try again with valid details');
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigation.reset).not.toHaveBeenCalled();
  });

  it('navigates cleanly straight to Login Screen view routing when requested', async () => {
    await render(<SignupScreen navigation={mockNavigation} />);

    await fireEvent.press(screen.getByText('Go to Login'));

    expect(mockNavigation.replace).toHaveBeenCalledWith(LOGIN_SCREEN);
  });
});
