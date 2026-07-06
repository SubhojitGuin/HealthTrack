import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import AboutScreen from './AboutScreen'; // Adjust path based on your folder structure

// Mock react-redux to control the theme state injected into the component
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('AboutScreen Component Tests', () => {
  const mockColors = {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Inject the theme colors mock into the selector hook
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        theme: {
          colors: mockColors,
        },
      })
    );
  });

  it('renders headers, descriptors, and static information nodes correctly', async () => {
    await render(<AboutScreen />);

    // Verify main screen title and card sections exist in the tree
    expect(screen.getByText('About HealthTrack')).toBeTruthy();
    expect(screen.getByText('🏋️ HealthTrack')).toBeTruthy();
    expect(screen.getByText('✨ Features')).toBeTruthy();
    expect(screen.getByText('🎯 Our Mission')).toBeTruthy();
    expect(screen.getByText('📱 App Information')).toBeTruthy();
  });

  it('renders all the core application feature bullet points flawlessly', async () => {
    await render(<AboutScreen />);

    // Validate existence of structural feature list rows
    expect(screen.getByText('• User Registration & Login')).toBeTruthy();
    expect(screen.getByText('• Personalized Dashboard')).toBeTruthy();
    expect(screen.getByText('• Workout Tracking')).toBeTruthy();
    expect(screen.getByText('• Nutrition Monitoring')).toBeTruthy();
    expect(screen.getByText('• Profile & Progress Photos')).toBeTruthy();
    expect(screen.getByText('• Search & Filter Workouts')).toBeTruthy();
  });

  it('displays accurate application deployment properties and copyright texts', async () => {
    await render(<AboutScreen />);

    // Verify system data properties are listed
    expect(screen.getByText('Version : 1.0.0')).toBeTruthy();
    expect(screen.getByText('Platform : React Native (Expo)')).toBeTruthy();
    expect(screen.getByText('Backend : JSON Server')).toBeTruthy();

    // Verify footer texts match expected layout
    expect(screen.getByText('Made with ❤️ for Health & Fitness')).toBeTruthy();
    expect(screen.getByText('© 2026 HealthTrack. All Rights Reserved.')).toBeTruthy();
  });

    it('applies the explicit design properties and tokens from Redux theme configuration correctly', async () => {
    await render(<AboutScreen />);

    const headerTitleElement = screen.getByText('About HealthTrack');
    const appTitleElement = screen.getByText('🏋️ HealthTrack');
    const footerTextElement = screen.getByText('© 2026 HealthTrack. All Rights Reserved.');

    // Safely extract containing native elements without modifying the source file
    // Text -> View (styles.header)
    const headerWrapperCard = headerTitleElement.parent;
    
    // Text -> View (styles.header) -> ScrollView Content Container (React Native implementation detail) -> ScrollView Base Container
    // We fetch the highest accessible node containing our base container style definitions
    const scrollContainer = headerWrapperCard.parent.parent;

    // Flatten layouts safely to cross-verify theme engine injection parameters
    const flatContainerStyle = StyleSheet.flatten(scrollContainer.props.style);
    const flatHeaderStyle = StyleSheet.flatten(headerWrapperCard.props.style);
    const flatTitleStyle = StyleSheet.flatten(headerTitleElement.props.style);
    const flatAppTitleStyle = StyleSheet.flatten(appTitleElement.props.style);
    const flatFooterStyle = StyleSheet.flatten(footerTextElement.props.style);

    expect(flatContainerStyle.backgroundColor).toBe(mockColors.background);
    expect(flatHeaderStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatTitleStyle.color).toBe(mockColors.text);
    expect(flatAppTitleStyle.color).toBe(mockColors.primary);
    expect(flatFooterStyle.color).toBe(mockColors.textSecondary);
  });
});
