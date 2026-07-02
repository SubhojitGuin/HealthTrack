import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const WorkoutHistoryCard = ({ workoutName, date, duration, calories }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{workoutName}</Text>
        <Text style={styles.subtitle}>{date}</Text>
        <Text style={styles.successText}>{calories} cal burned</Text>
      </View>
      <View>
        <Text style={styles.durationText}>{duration} min</Text>
      </View>
    </View>
  )
}

export default WorkoutHistoryCard

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  successText: {
    fontSize: 12,
    color: 'green',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'light',
  },
})