import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SectionHeader from '../../components/SectionHeader';
import { updateUserPreferences } from '../../api/fitnessService';
import { setUserPreferences } from '../../store/slices/workoutSlice';
import { setTheme } from '../../store/slices/themeSlice';
import { storageService } from '../../services/storageService';
import { Picker } from '@react-native-picker/picker';

const GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Flexibility',
  'Endurance',
]

export default function SettingsScreen() {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  const user = useSelector((state) => state.auth.user);
  const preferences = useSelector((state) => state.workout.userPreferences);
  const theme = useSelector((state) => state.theme.mode);

  const dispatch = useDispatch();

  const changeNotification = (value) => {
    const newPreferences = { ...preferences, notificationsEnabled: value };
    updateUserPreferences(preferences.id, newPreferences);
    dispatch(setUserPreferences({ preferences: newPreferences }));
    storageService.saveUserPreferences(newPreferences);
    console.log("Notification preference changed to:", value);
  }

  const changeTheme = (value) => {
    const newPreferences = { ...preferences, theme: value ? 'dark' : 'light' };
    updateUserPreferences(preferences.id, newPreferences);
    dispatch(setUserPreferences({ preferences: newPreferences }));
    dispatch(setTheme({ mode: value ? 'dark' : 'light' }));
    storageService.saveUserPreferences(newPreferences);
    console.log("Theme changed to:", value ? 'dark' : 'light');
  }

  const changeGoal = (goal) => {
    const newPreferences = { ...preferences, goal: goal };
    updateUserPreferences(preferences.id, newPreferences);
    dispatch(setUserPreferences({ preferences: newPreferences }));
    storageService.saveUserPreferences(newPreferences);
    console.log("Goal changed to:", goal);
  }

  return (
    <View style={styles.container}>
      <SectionHeader text="Settings" subtitle="Manage your account and preferences" />

      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Name: {user.name}</Text>
        <Text style={styles.text}>Email: {user.email}</Text>
        <Text style={styles.text}>Age: {user.age}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch value={preferences.notificationsEnabled} onValueChange={changeNotification} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={changeTheme} />
        </View>
        
        <View style={styles.pickerRow}>
          <Text style={styles.settingText}>Goal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferences.goal}
              onValueChange={changeGoal}
              style={styles.picker}
              dropdownIconColor={colors.textSecondary}
              itemStyle={{ color: colors.text, fontSize: 16 }}
            >
              {GOALS.map((goal) => (
                <Picker.Item 
                  key={goal} 
                  label={goal} 
                  value={goal} 
                  color={colors.text}
                  style={{ backgroundColor: colors.card }}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Units</Text>
        <Text style={styles.text}>Weight: kg</Text>
        <Text style={styles.text}>Height: cm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>App Version</Text>
        <Text style={styles.text}>HealthTrack v1.0.0</Text>
      </View>
    </View>
  )
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
    overflow: 'hidden',
    width: 160,
    height: 44,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: colors.text,
    backgroundColor: 'transparent',
  }
})
