import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import LoginScreen from './LoginScreen'; 
import { loginUser, fetchUserPreferences } from '../../api/fitnessService';
import { login } from '../../store/slices/authSlice';
import { setUserPreferences } from '../../store/slices/workoutSlice';
import { setTheme } from '../../store/slices/themeSlice';
import { tokenManager } from '../../utils/tokenManager';
import { storageService } from '../../services/storageService';
import { DRAWER_NAVIGATOR, SIGNUP_SCREEN } from '../../navigation/routes';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: { colors: { text: '#000000', textSecondary: '#666666' } },
    })
  ),
}));

jest.mock('../../api/fitnessService', () => ({
  loginUser: jest.fn(),
  fetchUserPreferences: jest.fn(),
}));

jest.mock('../../store/slices/authSlice', () => ({ login: jest.fn((p) => p) }));
jest.mock('../../store/slices/workoutSlice', () => ({ setUserPreferences: jest.fn((p) => p) }));
jest.mock('../../store/slices/themeSlice', () => ({ setTheme: jest.fn((p) => p) }));

jest.mock('../../utils/tokenManager', () => ({ tokenManager: { setToken: jest.fn() } }));
jest.mock('../../services/storageService', () => ({
  storageService: { saveUserData: jest.fn(), saveUserPreferences: jest.fn() },
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

describe('LoginScreen Integration Tests', () => {
  const mockNavigation = {
    reset: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getLoginButton = () => screen.getAllByText('Login')[1];

  it('renders input elements, buttons, and headers correctly', async () => {
    await render(<LoginScreen navigation={mockNavigation} />);

    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getAllByText('Login').length).toBe(2);
    expect(screen.getByText('Go to Signup')).toBeTruthy();
  });

  it('displays Formik validation errors if empty strings are sent submitted', async () => {
    await render(<LoginScreen navigation={mockNavigation} />);

    await fireEvent.press(getLoginButton());

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });

    expect(loginUser).not.toHaveBeenCalled();
  });

  it('displays invalid email schema errors when typing incorrect addresses', async () => {
    await render(<LoginScreen navigation={mockNavigation} />);

    const emailInput = screen.getByPlaceholderText('Email');
    await fireEvent.changeText(emailInput, 'invalid-email-string');
    
    await fireEvent.press(getLoginButton());

    await waitFor(() => {
      expect(screen.getByText('Invalid Email')).toBeTruthy();
    });
  });

  it('executes successful authentication pipelines, updates state, and navigates', async () => {
    const mockUserResponse = { id: 'user-123', email: 'test@demo.com', token: 'jwt-token-xyz' };
    const mockPreferencesResponse = { theme: 'dark', notifications: true };

    loginUser.mockResolvedValueOnce(mockUserResponse);
    fetchUserPreferences.mockResolvedValueOnce(mockPreferencesResponse);

    await render(<LoginScreen navigation={mockNavigation} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@demo.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    await fireEvent.press(getLoginButton());

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@demo.com', 'password123');
      expect(fetchUserPreferences).toHaveBeenCalledWith('user-123');
    });

    expect(login).toHaveBeenCalledWith({ user: mockUserResponse, token: 'jwt-token-xyz' });
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: mockPreferencesResponse });
    expect(setTheme).toHaveBeenCalledWith({ mode: 'dark' });
    expect(mockDispatch).toHaveBeenCalledTimes(3);

    expect(tokenManager.setToken).toHaveBeenCalledWith('jwt-token-xyz');
    expect(storageService.saveUserData).toHaveBeenCalledWith(mockUserResponse);
    expect(storageService.saveUserPreferences).toHaveBeenCalledWith(mockPreferencesResponse);

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: DRAWER_NAVIGATOR }],
    });
  });

  it('triggers error text feedback system popups if login attempts fail', async () => {
    loginUser.mockRejectedValueOnce(new Error('Unauthorized'));

    await render(<LoginScreen navigation={mockNavigation} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'wrong@demo.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrong-password');
    await fireEvent.press(getLoginButton());

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('wrong@demo.com', 'wrong-password');
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Failed',
        'Invalid email or password. Please try again.'
      );
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigation.reset).not.toHaveBeenCalled();
  });

  it('navigates straight to the signup dashboard layout view when requested', async () => {
    await render(<LoginScreen navigation={mockNavigation} />);

    const signupButton = screen.getByText('Go to Signup');
    await fireEvent.press(signupButton);

    expect(mockNavigation.replace).toHaveBeenCalledWith(SIGNUP_SCREEN);
  });
});
