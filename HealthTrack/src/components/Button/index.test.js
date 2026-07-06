import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import Button from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Button Component', () => {
  const mockColors = {
    primary: '#1E90FF',
    textOnPrimary: '#FFFFFF',
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

  it('renders the correct title text', async () => {
    const titleText = 'Click Me';
    
    await render(<Button title={titleText} onPress={jest.fn()} />);

    expect(screen.getByText(titleText)).toBeTruthy();
  });

  it('triggers the onPress function when pressed', async () => {
    const mockOnPress = jest.fn();
    await render(<Button title="Submit" onPress={mockOnPress} />);

    const buttonElement = screen.getByText('Submit');
    
    await fireEvent.press(buttonElement);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies style properties from the Redux theme colors data', async () => {
    await render(<Button title="Styled Button" onPress={jest.fn()} />);
    
    const textElement = screen.getByText('Styled Button');
    const touchableContainer = textElement.parent;

    expect(touchableContainer.props.style).toEqual(
      expect.objectContaining({ backgroundColor: mockColors.primary })
    );
    expect(textElement.props.style).toEqual(
      expect.objectContaining({ color: mockColors.textOnPrimary })
    );
  });

  it('respects React.memo behavior and does not rerender when props stay identical', async () => {
    const mockOnPress = jest.fn();
    
    const { rerender } = await render(<Button title="Static" onPress={mockOnPress} />);

    await rerender(<Button title="Static" onPress={mockOnPress} />);
    
    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
