import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import WelcomeCard from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('WelcomeCard Component', () => {
  const mockColors = {
    welcomeCard: "#1E90FF",
    welcomeCardText: "#FFFFFF",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockImplementation((selectorFn) => 
      selectorFn({
        theme: {
          colors: mockColors,
        }
      })
    )
  });

  it('renders the welcome message text correctly', async () => {
    await render(<WelcomeCard name="John" />);

    expect(screen.getByText('Welcome, John! 👋')).toBeTruthy();
  });

  it('applies the correct background and text colors from the Redux theme', async () => {
    await render(<WelcomeCard name="John" />);

    const welcomeTextElement = screen.getByText('Welcome, John! 👋');
    const welcomeSubtitleElement = screen.getByText("Let's crush today's goals!");
    const welcomeCardContainer = welcomeTextElement.parent;

    const flatContainerStyle = StyleSheet.flatten(welcomeCardContainer.props.style);
    const flatSubtitleStyle = StyleSheet.flatten(welcomeSubtitleElement.props.style);
    const flatTextStyle = StyleSheet.flatten(welcomeTextElement.props.style);

    expect(flatContainerStyle.backgroundColor).toBe(mockColors.welcomeCard);
    expect(flatTextStyle.color).toBe(mockColors.welcomeCardText);
    expect(flatSubtitleStyle.color).toBe(mockColors.welcomeCardText);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<WelcomeCard name="John" />);

    rerender(<WelcomeCard name="John" />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});