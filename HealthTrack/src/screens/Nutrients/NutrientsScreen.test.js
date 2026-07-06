import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';
import NutrientsScreen from './NutrientsScreen'; 
import { fetchNutritionPlans } from '../../api/fitnessService';
import { setNutritionPlans } from '../../store/slices/workoutSlice';
import { DASHBOARD_SCREEN, WORKOUT_SCREEN } from '../../navigation/routes';

const mockStoreContainer = {
  current: {
    theme: { colors: { background: '#111', text: '#fff', textSecondary: '#888' } },
    workout: { nutritionPlans: [] }
  }
};

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selectorFn) => selectorFn(mockStoreContainer.current)),
}));

jest.mock('../../api/fitnessService', () => ({
  fetchNutritionPlans: jest.fn(),
}));

jest.mock('../../store/slices/workoutSlice', () => ({
  setNutritionPlans: jest.fn((p) => p),
}));

jest.mock('../../hooks/useDebounce', () => (value) => value);

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('NutrientsScreen Tests', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockNutritionPlans = [
    { id: 1, meal: 'Oatmeal Banana Bowl', type: 'Breakfast', calories: 350, protein: 10, carbs: 60, fats: 5 },
    { id: 2, meal: 'Avocado Toast', type: 'Breakfast', calories: 280, protein: 8, carbs: 30, fats: 14 },
    { id: 3, meal: 'Grilled Salmon Rice', type: 'Lunch', calories: 550, protein: 40, carbs: 45, fats: 18 },
    { id: 4, meal: 'Protein Bar Shake', type: 'Snack', calories: 200, protein: 25, carbs: 15, fats: 4 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStoreContainer.current = {
      theme: { colors: { background: '#111', text: '#fff', textSecondary: '#888' } },
      workout: { nutritionPlans: [] }
    };
    fetchNutritionPlans.mockResolvedValue(mockNutritionPlans);
  });

  it('displays the Loader component on mounting initialization', async () => {
    fetchNutritionPlans.mockReturnValueOnce(new Promise(() => {}));

    await render(<NutrientsScreen navigation={mockNavigation} />);
    expect(screen.getByText('Loading nutrient plans...')).toBeTruthy();
  });

  it('fetches nutrition profiles if store is empty and renders items correctly into list layouts', async () => {
    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    expect(fetchNutritionPlans).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setNutritionPlans({ plans: mockNutritionPlans }));
  });

  it('bypasses api fetch if store holds pre-loaded plan objects arrays', async () => {
    mockStoreContainer.current.workout.nutritionPlans = mockNutritionPlans;

    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    expect(fetchNutritionPlans).not.toHaveBeenCalled();
    expect(screen.getByText('Oatmeal Banana Bowl')).toBeTruthy();
    expect(screen.getByText('Grilled Salmon Rice')).toBeTruthy();
  });

  it('filters nutrient records dynamically when a user tabs specific type filters buttons', async () => {
    mockStoreContainer.current.workout.nutritionPlans = mockNutritionPlans;

    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    const breakfastFilterElements = screen.getAllByText('Breakfast');
    
    await act(async () => {
      await fireEvent.press(breakfastFilterElements[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Grilled Salmon Rice')).toBeNull();
    });

    expect(screen.getByText('Oatmeal Banana Bowl')).toBeTruthy();
    expect(screen.getByText('Avocado Toast')).toBeTruthy();
  });


  it('filters data dynamically via text search queries string characters', async () => {
    mockStoreContainer.current.workout.nutritionPlans = mockNutritionPlans;

    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    const searchInput = screen.getByPlaceholderText('Search meals...');
    await fireEvent.changeText(searchInput, 'Salmon');

    await waitFor(() => {
      expect(screen.queryByText('Oatmeal Banana Bowl')).toBeNull();
    });

    expect(screen.getByText('Grilled Salmon Rice')).toBeTruthy();
  });

  it('displays empty list components warnings if criteria results do not catch hits matches', async () => {
    mockStoreContainer.current.workout.nutritionPlans = mockNutritionPlans;

    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    const searchInput = screen.getByPlaceholderText('Search meals...');
    await fireEvent.changeText(searchInput, 'NonExistentMealName123');

    expect(screen.getByText('No nutrient plan available.')).toBeTruthy();
  });

  it('handles navigation redirects seamlessly when footer buttons are clicked', async () => {
    mockStoreContainer.current.workout.nutritionPlans = mockNutritionPlans;

    await render(<NutrientsScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading nutrient plans...')).toBeNull();
    });

    await fireEvent.press(screen.getByText('Go to Dashboard'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(DASHBOARD_SCREEN);

    await fireEvent.press(screen.getByText('Go to Workouts'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(WORKOUT_SCREEN);
  });
});
