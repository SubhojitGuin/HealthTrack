import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import OutdoorRunScreen from './OutdoorRunScreen';
import { fetchOutdoorRunData } from '../../api/fitnessService';

jest.mock('@react-navigation/native', () => {
  const { useEffect } = require('react'); 
  return {
    useFocusEffect: (cb) => useEffect(() => cb(), []),
  };
});

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selectorFn) =>
    selectorFn({
      theme: { colors: { background: '#111', text: '#fff', textSecondary: '#888', border: '#222' } },
      auth: { user: { id: 'runner-999' } },
    })
  ),
}));

jest.mock('../../api/fitnessService', () => ({
  fetchOutdoorRunData: jest.fn(),
}));

const mockFitToCoordinates = jest.fn();
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  class MockMapView extends React.Component {
    fitToCoordinates = mockFitToCoordinates;
    render() {
      return <View testID="mock-map-view">{this.props.children}</View>;
    }
  }

  const MockMarker = (props) => <View testID="mock-marker">{props.children}</View>;
  const MockPolyline = (props) => <View testID="mock-polyline">{props.children}</View>;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

describe('OutdoorRunScreen Tests', () => {
  const mockRunData = [
    {
      id: 'run-1',
      date: '2026-07-01',
      distanceKm: 5.2,
      durationMinutes: 25,
      routeCoordinates: [
        { latitude: 37.7749, longitude: -122.4194 },
        { latitude: 37.7752, longitude: -122.4189 },
      ],
    },
    {
      id: 'run-2',
      date: '2026-07-04',
      distanceKm: 10.1,
      durationMinutes: 52,
      routeCoordinates: [
        { latitude: 40.7128, longitude: -74.0060 },
        { latitude: 40.7135, longitude: -74.0051 },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchOutdoorRunData.mockResolvedValue(mockRunData);
  });

  it('displays the Loader component on mounting initialization', async () => {
    fetchOutdoorRunData.mockReturnValueOnce(new Promise(() => {}));

    await render(<OutdoorRunScreen />);
    expect(screen.getByText('Loading map...')).toBeTruthy();
  });

  it('fetches run data successfully, loads the map view, and shows metrics for the first run', async () => {
    await render(<OutdoorRunScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Loading map...')).toBeNull();
    });

    expect(fetchOutdoorRunData).toHaveBeenCalledWith('runner-999');
    
    expect(screen.getByText('2026-07-01')).toBeTruthy();
    expect(screen.getByText('5.2 km')).toBeTruthy();
    expect(screen.getByText('25 min')).toBeTruthy();

    expect(screen.getByTestId('mock-map-view')).toBeTruthy();
    expect(screen.getAllByTestId('mock-marker').length).toBe(2);
    expect(screen.getByTestId('mock-polyline')).toBeTruthy();
  });

  it('displays the no-data fallback view if the user history profile contains 0 records', async () => {
    fetchOutdoorRunData.mockResolvedValueOnce([]);

    await render(<OutdoorRunScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Loading map...')).toBeNull();
    });

    expect(screen.getByText('No outdoor run data available.')).toBeTruthy();
    
    expect(screen.queryByTestId('mock-map-view')).toBeNull();
  });

  it('switches views smoothly, updates active metrics, and calls fitToCoordinates on mapRef when a filter tab button is pressed', async () => {
    await render(<OutdoorRunScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Loading map...')).toBeNull();
    });

    const runTwoButton = screen.getByText('Run #2');
    await fireEvent.press(runTwoButton);

    expect(screen.getByText('2026-07-04')).toBeTruthy();
    expect(screen.getByText('10.1 km')).toBeTruthy();
    expect(screen.getByText('52 min')).toBeTruthy();

    expect(mockFitToCoordinates).toHaveBeenCalledWith(
      mockRunData[1].routeCoordinates,
      expect.objectContaining({
        edgePadding: { top: 50, right: 50, bottom: 240, left: 50 },
        animated: true,
      })
    );
  });
});
