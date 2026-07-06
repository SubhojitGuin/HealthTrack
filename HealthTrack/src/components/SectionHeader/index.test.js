import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import SectionHeader from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('SectionHeader Component', () => {
  const mockColors = {
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
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

  it('renders the header text and subtitle correctly when both props are passed', async () => {
    await render(<SectionHeader text="Daily Progress" subtitle="Track your goals" />);

    expect(screen.getByText('Daily Progress')).toBeTruthy();
    expect(screen.getByText('Track your goals')).toBeTruthy();
  });

  it('does not render the subtitle element if the subtitle prop is completely omitted', async () => {
    await render(<SectionHeader text="Overview" />);

    expect(screen.getByText('Overview')).toBeTruthy();
    
    const subtitleNode = screen.queryByText('Track your goals');
    expect(subtitleNode).toBeNull();
  });

  it('applies the explicit design properties from the Redux theme colors mapping', async () => {
    await render(<SectionHeader text="Themed Header" subtitle="Themed Subtitle" />);

    const headerElement = screen.getByText('Themed Header');
    const subtitleElement = screen.getByText('Themed Subtitle');

    const flatHeaderStyle = StyleSheet.flatten(headerElement.props.style);
    const flatSubtitleStyle = StyleSheet.flatten(subtitleElement.props.style);

    expect(flatHeaderStyle.color).toBe(mockColors.text);
    expect(flatSubtitleStyle.color).toBe(mockColors.textSecondary);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<SectionHeader text="Static Title" />);

    await rerender(<SectionHeader text="Static Title" />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
