import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import FilterButton from './index';
import { StyleSheet } from 'react-native';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('FilterButton Component', () => {
  const mockColors = {
    surface: '#222222',
    primary: '#1E90FF',
    text: '#FFFFFF',
    textOnPrimary: '#000000',
  };

  const mockItem = {
    label: 'Run #1',
    value: 0,
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

  it('renders the correct item label text', async () => {
    await render(<FilterButton item={mockItem} isSelected={false} onPress={jest.fn()} />);

    expect(screen.getByText('Run #1')).toBeTruthy();
  });

  it('triggers the onPress function when clicked', async () => {
    const mockOnPress = jest.fn();
    await render(<FilterButton item={mockItem} isSelected={false} onPress={mockOnPress} />);

    const buttonText = screen.getByText('Run #1');
    await fireEvent.press(buttonText);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies default inactive styles when isSelected is false', async () => {
    await render(<FilterButton item={mockItem} isSelected={false} onPress={jest.fn()} />);

    const textElement = screen.getByText('Run #1');
    const containerElement = textElement.parent;

    const flatContainerStyle = StyleSheet.flatten(containerElement.props.style);
    const flatTextStyle = StyleSheet.flatten(textElement.props.style);

    expect(flatContainerStyle).toEqual(
      expect.objectContaining({ backgroundColor: mockColors.surface })
    );
    expect(flatTextStyle).toEqual(
      expect.objectContaining({ color: mockColors.text })
    );

    expect(flatContainerStyle.backgroundColor).not.toBe(mockColors.primary);
  });

  it('applies explicit active styles when isSelected is true', async () => {
    await render(<FilterButton item={mockItem} isSelected={true} onPress={jest.fn()} />);

    const textElement = screen.getByText('Run #1');
    const containerElement = textElement.parent;

    const flatContainerStyle = StyleSheet.flatten(containerElement.props.style);
    const flatTextStyle = StyleSheet.flatten(textElement.props.style);

    expect(flatContainerStyle).toEqual(
      expect.objectContaining({ backgroundColor: mockColors.primary })
    );
    expect(flatTextStyle).toEqual(
      expect.objectContaining({ color: mockColors.textOnPrimary })
    );
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const mockOnPress = jest.fn();
    const { rerender } = await render(
      <FilterButton item={mockItem} isSelected={false} onPress={mockOnPress} />
    );

    await rerender(<FilterButton item={mockItem} isSelected={false} onPress={mockOnPress} />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
