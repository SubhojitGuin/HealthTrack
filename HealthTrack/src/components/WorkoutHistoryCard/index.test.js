import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import WorkoutHistoryCard from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('WorkoutHistoryCard Component', () => {
  const mockColors = {
    surface: '#222222',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    success: '#4CD964',
    shadow: '#000000',
  };

  const mockProps = {
    workoutName: 'HIIT Circuit Training',
    date: 'July 6, 2026',
    duration: 45,
    calories: 380,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        theme: {
          colors: mockColors,
        },
      })
    );
  });

  it('renders all structural workout details and string metrics correctly', async () => {
    await render(<WorkoutHistoryCard {...mockProps} />);

    expect(screen.getByText('HIIT Circuit Training')).toBeTruthy();
    expect(screen.getByText('July 6, 2026')).toBeTruthy();
    expect(screen.getByText('380 cal burned')).toBeTruthy();
    expect(screen.getByText('45 min')).toBeTruthy();
  });

  it('applies the explicit design properties and color tokens from Redux correctly', async () => {
    await render(<WorkoutHistoryCard {...mockProps} />);

    const titleElement = screen.getByText('HIIT Circuit Training');
    const dateElement = screen.getByText('July 6, 2026');
    const caloriesElement = screen.getByText('380 cal burned');
    const durationElement = screen.getByText('45 min');
    
    const mainContainer = titleElement.parent.parent;

    const flatContainerStyle = StyleSheet.flatten(mainContainer.props.style);
    const flatTitleStyle = StyleSheet.flatten(titleElement.props.style);
    const flatDateStyle = StyleSheet.flatten(dateElement.props.style);
    const flatCaloriesStyle = StyleSheet.flatten(caloriesElement.props.style);
    const flatDurationStyle = StyleSheet.flatten(durationElement.props.style);

    expect(flatContainerStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatContainerStyle.shadowColor).toBe(mockColors.shadow);
    expect(flatTitleStyle.color).toBe(mockColors.text);
    expect(flatDateStyle.color).toBe(mockColors.textSecondary);
    expect(flatCaloriesStyle.color).toBe(mockColors.success);
    expect(flatDurationStyle.color).toBe(mockColors.text);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<WorkoutHistoryCard {...mockProps} />);

    await rerender(<WorkoutHistoryCard {...mockProps} />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
