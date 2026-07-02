import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const WelcomeCard = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}! 👋</Text>
      <Text style={styles.subtitle}>Let's crush today's goals!</Text>
    </View>
  )
}

export default WelcomeCard

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#7822ce',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
  },
})