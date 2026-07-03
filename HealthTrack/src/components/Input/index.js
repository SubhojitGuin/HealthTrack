import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

const Input = ({
  placeholder,
  label,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  onBlur
}) => {
  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        keyboardType={keyboardType}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default Input;

const getStyles = (colors) => 
  StyleSheet.create({
    container: { marginBottom: 16 },
    label: { 
      fontSize: 16, 
      marginBottom: 8,
      color: colors.text
    },
    input: {
      height: 48,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: colors.text,
      backgroundColor: colors.surface
    },
  })
;
