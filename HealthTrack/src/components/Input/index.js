import { StyleSheet, Text, View, TextInput } from 'react-native'; // Fixed import
import React from 'react';

const Input = ({
  placeholder,
  label,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  onBlur
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        keyboardType={keyboardType}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default Input;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
});
