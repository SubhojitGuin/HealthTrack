import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const SummaryCard = ({ title, value }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default SummaryCard

const getStyles = (colors) => StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text,
  },
  title: {
    fontSize: 12,
    color: colors.textSecondary,
  },
})