import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import SummaryCard from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('SummaryCard Component', () => {
  const mockColors = {
    surface: '#222222',
    shadow: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
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

  it('renders all summary metrics and labels correctly', async () => {
    await render(<SummaryCard title="Daily Summary" value="10,000" />);

    expect(screen.getByText('Daily Summary')).toBeTruthy();
    expect(screen.getByText('10,000')).toBeTruthy();
  })

  it('applies the explicit layout design and theme styles correctly', async () => {
    await render(<SummaryCard title="Themed Title" value="Themed Value" />);

    const valueElement = screen.getByText('Themed Value');
    const titleElement = screen.getByText('Themed Title');
    
    const cardContainer = valueElement.parent;

    const flatContainerStyle = StyleSheet.flatten(cardContainer.props.style);
    const flatValueStyle = StyleSheet.flatten(valueElement.props.style);
    const flatTitleStyle = StyleSheet.flatten(titleElement.props.style);

    expect(flatContainerStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatContainerStyle.shadowColor).toBe(mockColors.shadow);
    expect(flatValueStyle.color).toBe(mockColors.text);
    expect(flatTitleStyle.color).toBe(mockColors.textSecondary);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<SummaryCard title="Static Title" value="100" />);

    await rerender(<SummaryCard title="Static Title" value="100" />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});