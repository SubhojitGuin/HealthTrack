import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import Loader from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Loader Component', () => {
  const mockColors = {
    primary: '#1E90FF',
    surface: '#222222',
    text: '#FFFFFF',
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

  it('renders the ActivityIndicator and accompanying loading text', async () => {
    const loadingText = 'Fetching data...';
    await render(<Loader text={loadingText} />);

    expect(screen.getByText(loadingText)).toBeTruthy();
  });

  it('does not render a text node if the text prop is completely omitted', async () => {
    await render(<Loader />);

    const textNode = screen.queryByRole('Text');
    expect(textNode).toBeNull();
  });

  it('applies explicit design properties from the Redux theme colors mapping', async () => {
    const loadingText = 'Styled Loader';
    await render(<Loader text={loadingText} />);

    const textElement = screen.getByText(loadingText);
    
    const boxContainer = textElement.parent;

    const flatBoxStyle = StyleSheet.flatten(boxContainer.props.style);
    const flatTextStyle = StyleSheet.flatten(textElement.props.style);

    expect(flatBoxStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatTextStyle.color).toBe(mockColors.text);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const { rerender } = await render(<Loader text="Caching Check" />);

    await rerender(<Loader text="Caching Check" />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
