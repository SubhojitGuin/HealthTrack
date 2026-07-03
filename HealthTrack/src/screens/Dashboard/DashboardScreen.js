import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WelcomeCard from '../../components/WelcomeCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAvailableWorkouts, fetchUserPreference, fetchWorkoutHistory } from '../../api/fitnessService';
import { setUserWorkoutHistory } from '../../store/slices/workoutSlice';
import SummaryCard from '../../components/SummaryCard';
import SectionHeader from '../../components/SectionHeader';
import WorkoutHistoryCard from '../../components/WorkoutHistoryCard';
import Button from '../../components/Button';
import { PROFILE_SCREEN, WORKOUT_SCREEN } from '../../navigation/routes';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';

export default function DashboardScreen({ navigation }) {

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [workoutHistory, setWorkoutHistory] = React.useState(useSelector((state) => state.workout.history));
  const [workouts, setWorkouts] = React.useState(useSelector((state) => state.workout.availableWorkouts));
  const [preference, setPreference] = React.useState(useSelector((state) => state.workout.userPreference));
  const [isLoading, setIsLoading] = React.useState(true);

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    return names[0];
  }

  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      setIsLoading(true);

      const apiPromises = [
        fetchAvailableWorkouts()
          .then(data => {
            if (isMounted) setWorkouts(data);
          })
          .catch(error => console.error("Failed to fetch available workouts:", error)),
      ];

      if (user?.id) {
        apiPromises.push(
          fetchWorkoutHistory(user.id)
            .then(history => {
              if (isMounted) {
                history.sort((a, b) => new Date(b.date) - new Date(a.date));
                setWorkoutHistory(history);
                dispatch(setUserWorkoutHistory({ history }));
              }
            })
            .catch(error => console.error("Failed to fetch workout history:", error))
        );

        apiPromises.push(fetchUserPreference(user.id)
          .then(pref => {
            if (isMounted) setPreference(pref);
          })
          .catch(error => console.error("Failed to fetch user preference:", error))
        );
      }

      Promise.all(apiPromises)
        .then(() => {
          if (isMounted) setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch available workouts:", error);
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }, [user?.id, dispatch])
  );

  const totalWorkoutsCount = workoutHistory.length;

  const totalCaloriesBurnt = React.useMemo(() => {
    return workoutHistory.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0);
  }, [workoutHistory]);

  const totalDurationCompleted = React.useMemo(() => {
    return workoutHistory.reduce((total, workout) => total + (workout.durationCompleted || 0), 0);
  }, [workoutHistory]);

  const detailedWorkoutHistory = React.useMemo(() => {
    return workoutHistory.map(workout => {
      const workoutDetails = workouts.find(w => w.id === workout.workoutId);
      return {
        ...workout,
        workoutName: workoutDetails ? workoutDetails.name : 'Unknown Workout',
      };
    });
  }, [workoutHistory, workouts]);

  const goal = preference ? preference.goal : null;

  if (isLoading) {
    return (
      <Loader text="Loading dashboard..." />
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <WelcomeCard name={getFirstName(user?.name)} />

      <View style={styles.summaryContainer}>
        <SummaryCard title="Workouts" value={totalWorkoutsCount} />
        <SummaryCard title="Calories" value={totalCaloriesBurnt} />
        <SummaryCard title="Minutes" value={totalDurationCompleted} />
      </View>

      <SectionHeader text="Workout History" />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <SectionHeader text="Your Goal"/>
      <SummaryCard title="Your Goal" value={goal ? `🎯 ${goal}` : "No goal set"} />

      <View style={styles.buttonContainer}>
        <Button title="🏋️Go to Workouts" onPress={() => navigation.navigate(WORKOUT_SCREEN)} />
        <Button title="🏋️Go to Profile" onPress={() => navigation.navigate(PROFILE_SCREEN)} />
      </View>
    </View>
  );

  return (
    <FlatList 
      style={styles.container}
      data={detailedWorkoutHistory}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<Text style={styles.emptyText}>No workout history available.</Text>}
      renderItem={({ item }) => (
        <WorkoutHistoryCard
          workoutName={item.workoutName}
          date={item.date}
          duration={item.durationCompleted}
          calories={item.caloriesBurned}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginTop: 10,
  },
  footerContainer: {
    marginTop: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    gap: 10,
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 10,
  }
})
