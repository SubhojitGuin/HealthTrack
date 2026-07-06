import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import Input from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Input Component', () => {
  const mockColors = {
    text: '#FFFFFF',
    textMuted: '#888888',
    primary: '#1E90FF',
    border: '#CCCCCC',
    surface: '#222222',
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

  it('renders the label and placeholder text correctly', async () => {
    await render(
      <Input 
        label="Username" 
        placeholder="Enter your username" 
        value="" 
        onChangeText={jest.fn()} 
      />
    );

    expect(screen.getByText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your username')).toBeTruthy();
  });

  it('does not render the label element if the label prop is omitted', async () => {
    await render(
      <Input 
        placeholder="Search..." 
        value="" 
        onChangeText={jest.fn()} 
      />
    );

    const labelNode = screen.queryByText('Username');
    expect(labelNode).toBeNull();
  });

  it('triggers onChangeText when the user types into the field', async () => {
    const mockOnChangeText = jest.fn();
    await render(
      <Input 
        placeholder="Type here" 
        value="" 
        onChangeText={mockOnChangeText} 
      />
    );

    const textInput = screen.getByPlaceholderText('Type here');
    
    await fireEvent.changeText(textInput, 'Hello World');

    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

  it('triggers the onBlur function hook when selection focus shifts away', async () => {
    const mockOnBlur = jest.fn();
    await render(
      <Input 
        placeholder="Focus test" 
        value="" 
        onChangeText={jest.fn()} 
        onBlur={mockOnBlur} 
      />
    );

    const textInput = screen.getByPlaceholderText('Focus test');
    
    await fireEvent(textInput, 'blur');

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('passes through structural layout configuration attributes correctly', async () => {
    await render(
      <Input 
        placeholder="Secure entry" 
        value="secret123" 
        onChangeText={jest.fn()} 
        keyboardType="email-address"
        secureTextEntry={true}
      />
    );

    const textInput = screen.getByPlaceholderText('Secure entry');

    expect(textInput.props.keyboardType).toBe('email-address');
    expect(textInput.props.secureTextEntry).toBe(true);
    expect(textInput.props.value).toBe('secret123');
  });

  it('applies explicit design properties from the Redux theme colors data mapping', async () => {
    await render(
      <Input 
        label="Themed Label" 
        placeholder="Themed Placeholder" 
        value="" 
        onChangeText={jest.fn()} 
      />
    );

    const labelElement = screen.getByText('Themed Label');
    const inputElement = screen.getByPlaceholderText('Themed Placeholder');

    const flatLabelStyle = StyleSheet.flatten(labelElement.props.style);
    const flatInputStyle = StyleSheet.flatten(inputElement.props.style);

    expect(flatLabelStyle.color).toBe(mockColors.text);
    expect(flatInputStyle.borderColor).toBe(mockColors.border);
    expect(flatInputStyle.backgroundColor).toBe(mockColors.surface);
    expect(flatInputStyle.color).toBe(mockColors.text);
    
    expect(inputElement.props.placeholderTextColor).toBe(mockColors.textMuted);
    expect(inputElement.props.cursorColor).toBe(mockColors.primary);
    expect(inputElement.props.selectionColor).toBe(mockColors.primary);
  });

  it('respects React.memo parameters and skips duplicate renders on invariant props', async () => {
    const mockOnChange = jest.fn();
    const { rerender } = await render(
      <Input placeholder="Memo Check" value="Test" onChangeText={mockOnChange} />
    );

    await rerender(<Input placeholder="Memo Check" value="Test" onChangeText={mockOnChange} />);

    expect(useSelector).toHaveBeenCalledTimes(1);
  });
});
