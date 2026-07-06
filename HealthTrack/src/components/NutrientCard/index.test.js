import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import NutrientCard from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('NutrientCard Component', () => {
  const mockColors = {
    surface: '#222222',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    shadow: '#000000',
  };

  const mockNutrient = {
    meal: 'Grilled Chicken Salad',
    type: 'Lunch',
    calories: 450,
    protein: 35,
    carbs: 12,
    fats: 15,
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

  it('renders all meal metrics and labels correctly', async () => {
    await render(<NutrientCard nutrient={mockNutrient} />);

    expect(screen.getByText('Grilled Chicken Salad')).toBeTruthy();
    expect(screen.getByText('Lunch')).toBeTruthy();
    expect(screen.getByText('450 cal')).toBeTruthy();
    expect(screen.getByText('35g protein')).toBeTruthy();
    expect(screen.getByText('12g carbs')).toBeTruthy();
    expect(screen.getByText('15g fats')).toBeTruthy();
  });

  it('applies the structural theme styling correctly', async () => {
    await render(<NutrientCard nutrient={mockNutrient} />);

    const titleElement = screen.getByText('Grilled Chicken Salad');
    const typeElement = screen.getByText('Lunch');
    const calorieElement = screen.getByText('450 cal');
    
    const cardContainer = titleElement.parent;

    const flatContainerStyle = StyleSheet.flatten(cardContainer.props.style);
    const flatTitleStyle = StyleSheet.flatten(titleElement.props.style);
    const flatTypeStyle = StyleSheet.flatten(typeElement.props.style);
    const flatNutrientStyle = StyleSheet.flatten(calorieElement.props.style);

    expect(flatContainerStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatContainerStyle.shadowColor).toBe(mockColors.shadow);
    expect(flatTitleStyle.color).toBe(mockColors.text);
    expect(flatTypeStyle.color).toBe(mockColors.textSecondary);
    expect(flatNutrientStyle.color).toBe(mockColors.text);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<NutrientCard nutrient={mockNutrient} />);

    await rerender(<NutrientCard nutrient={mockNutrient} />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
