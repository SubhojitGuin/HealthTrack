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

export default function DashboardScreen({ navigation }) {

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [ workoutHistory, setWorkoutHistory ] = React.useState(useSelector((state) => state.workout.history));
  const [ totalWorkoutsCount, setTotalWorkoutsCount ] = React.useState(0);
  const [ totalCaloriesBurnt, setTotalCaloriesBurnt ] = React.useState(0);
  const [ totalDurationCompleted, setTotalDurationCompleted ] = React.useState(0);

  const [ workouts, setWorkouts ] = React.useState(useSelector((state) => state.workout.availableWorkouts));
  const [ detailedWorkoutHistory, setDetailedWorkoutHistory ] = React.useState([]);

  const [ preference, setPreference ] = React.useState(useSelector((state) => state.workout.userPreference));
  const [ goal, setGoal ] = React.useState(preference ? preference.goal : null);

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    return names[0];
  }

  React.useEffect(() => {
    if (workouts.length === 0) {
      fetchAvailableWorkouts().then(workouts => {
        setWorkouts(workouts);
      }
      ).catch(error => {
        console.error("Failed to fetch available workouts:", error);
      });
    }
  }, [workouts]);

  React.useEffect(() => {
    if (workoutHistory.length === 0) {
      fetchWorkoutHistory(user.id).then(history => {
        history.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkoutHistory(history);
        dispatch(setUserWorkoutHistory({ history }));
      }).catch(error => {
        console.error("Failed to fetch workout history:", error);
      });
    }

    setTotalWorkoutsCount(workoutHistory.length);
    setTotalCaloriesBurnt(workoutHistory.reduce((total, workout) => total + workout.caloriesBurned, 0));
    setTotalDurationCompleted(workoutHistory.reduce((total, workout) => total + workout.durationCompleted, 0));
  }, [workoutHistory]);

  React.useEffect(() => {
    const detailedHistory = workoutHistory.map(workout => {
      const workoutDetails = workouts.find(w => w.id === workout.workoutId);
      return {
        ...workout,
        workoutName: workoutDetails ? workoutDetails.name : 'Unknown Workout',
      };
    }
    );
    setDetailedWorkoutHistory(detailedHistory);
  }, [workoutHistory, workouts]);

  React.useEffect(() => {
    if (preference) {
      setGoal(preference.goal);
    } else {
      fetchUserPreference(user.id).then(pref => {
        setPreference(pref);
      }).catch(error => {
        console.error("Failed to fetch user preference:", error);
      });
    }

    setGoal(preference ? preference.goal : null);
  }, [preference]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <WelcomeCard name={getFirstName(user.name)} />

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
        <Button title="🏋️‍♀️Go to Workouts" onPress={() => navigation.navigate(WORKOUT_SCREEN)} />
        <Button title="🏋️‍♀️Go to Profile" onPress={() => navigation.navigate(PROFILE_SCREEN)} />
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
    paddingHorizontal: 20, // Moved padding from container to avoid clipping list items
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
