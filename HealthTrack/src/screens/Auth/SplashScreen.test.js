import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import SplashScreen from './SplashScreen';
import { tokenManager } from '../../utils/tokenManager';
import { storageService } from '../../services/storageService';
import { login } from '../../store/slices/authSlice';
import { setUserPreferences } from '../../store/slices/workoutSlice';
import { setTheme } from '../../store/slices/themeSlice';
import { DRAWER_NAVIGATOR, LOGIN_SCREEN } from '../../navigation/routes';
import { USER_STORAGE_KEY, PREFERENCES_STORAGE_KEY } from '../../utils/constants';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../../store/slices/authSlice', () => ({ login: jest.fn((p) => p) }));
jest.mock('../../store/slices/workoutSlice', () => ({ setUserPreferences: jest.fn((p) => p) }));
jest.mock('../../store/slices/themeSlice', () => ({ setTheme: jest.fn((p) => p) }));

jest.mock('../../utils/tokenManager', () => ({ tokenManager: { getToken: jest.fn() } }));
jest.mock('../../services/storageService', () => ({
  storageService: { getItem: jest.fn() },
}));

describe('SplashScreen Components Tests', () => {
  const mockNavigation = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates straight to Drawer Navigator when valid tokens and storage profile objects exist', async () => {
    const mockToken = 'cached-user-session-token-123';
    const mockUser = { id: 'usr-90', name: 'James Carter' };
    const mockPrefs = { theme: 'dark', notificationsEnabled: true };

    tokenManager.getToken.mockResolvedValueOnce(mockToken);
    storageService.getItem.mockImplementation((key) => {
      if (key === USER_STORAGE_KEY) return Promise.resolve(mockUser);
      if (key === PREFERENCES_STORAGE_KEY) return Promise.resolve(mockPrefs);
      return Promise.resolve(null);
    });

    await render(<SplashScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(tokenManager.getToken).toHaveBeenCalledTimes(1);
      expect(storageService.getItem).toHaveBeenCalledWith(USER_STORAGE_KEY);
      expect(storageService.getItem).toHaveBeenCalledWith(PREFERENCES_STORAGE_KEY);
    });

    expect(login).toHaveBeenCalledWith({ token: mockToken, user: mockUser });
    expect(setUserPreferences).toHaveBeenCalledWith({ preferences: mockPrefs });
    expect(setTheme).toHaveBeenCalledWith({ mode: 'dark' });
    expect(mockDispatch).toHaveBeenCalledTimes(3);

    expect(mockNavigation.replace).toHaveBeenCalledWith(DRAWER_NAVIGATOR);
  });

  it('redirects straight to Login Screen if device token manager evaluates to null', async () => {
    tokenManager.getToken.mockResolvedValueOnce(null);
    await render(<SplashScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(tokenManager.getToken).toHaveBeenCalledTimes(1);
      expect(mockNavigation.replace).toHaveBeenCalledWith(LOGIN_SCREEN);
    });

    expect(storageService.getItem).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('intercepts system runtime exceptions gracefully and falls back to Login routing', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    tokenManager.getToken.mockRejectedValueOnce(new Error('Secure storage decryption failure'));

    await render(<SplashScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith(LOGIN_SCREEN);
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
