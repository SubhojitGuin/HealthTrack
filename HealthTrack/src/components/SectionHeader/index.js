import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SectionHeader = ({ text, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

export default SectionHeader

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
})