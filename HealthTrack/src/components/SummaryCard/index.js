import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SummaryCard = ({ title, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default SummaryCard

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
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
  },
  title: {
    fontSize: 12,
    color: '#666',
  },
})