import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const WorkoutHistoryCard = ({ workoutName, date, duration, calories }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);
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

export default React.memo(WorkoutHistoryCard);

const getStyles = (colors) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: colors.shadow,
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
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  successText: {
    fontSize: 12,
    color: colors.success,
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'light',
    color: colors.text,
  },
})