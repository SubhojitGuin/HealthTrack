import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SectionHeader from '../../components/SectionHeader'
import { DASHBOARD_SCREEN, WORKOUT_SCREEN } from '../../navigation/routes'; // Fixed missing import
import { useDispatch, useSelector } from 'react-redux';
import { fetchNutritionPlans } from '../../api/fitnessService';
import { setNutritionPlans } from '../../store/slices/workoutSlice';
import Button from '../../components/Button';
import FilterButton from '../../components/FilterButton';
import NutrientCard from '../../components/NutrientCard';

const nutritionPlanTypes = [
  { label: "All", value: "" },
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snack", value: "Snack" },
];

export default function NutrientsScreen({ navigation }) {
  const dispatch = useDispatch();
  
  const storeNutritionPlans = useSelector((state) => state.workout.nutritionPlans) || [];

  const [ selectedPlanType, setSelectedPlanType ] = React.useState("");
  const [ filteredNutrients, setFilteredNutrients ] = React.useState([]);

  React.useEffect(() => {
    if (storeNutritionPlans.length === 0) {
      fetchNutritionPlans().then(plans => {
        dispatch(setNutritionPlans({ plans }));
      }).catch(error => {
        console.error("Failed to fetch nutrition plans:", error);
      });
    }
  }, [dispatch, storeNutritionPlans]);

  React.useEffect(() => {
    if (selectedPlanType) {
      setFilteredNutrients(storeNutritionPlans.filter(nutrient => nutrient.type === selectedPlanType));
    } else {
      setFilteredNutrients(storeNutritionPlans);
    }
  }, [selectedPlanType, storeNutritionPlans]);

  const handlePlanTypeChange = (type) => {
    setSelectedPlanType(type);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <SectionHeader text="Nutrient Plans" subtitle="Track your daily meals" />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        data={nutritionPlanTypes}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <FilterButton 
            item={item} 
            isSelected={selectedPlanType === item.value}
            onPress={() => handlePlanTypeChange(item.value)} 
          />
        )}
      />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <Button title="Go to Dashboard" onPress={() => navigation.navigate(DASHBOARD_SCREEN)} />
        <Button title="Go to Workouts" onPress={() => navigation.navigate(WORKOUT_SCREEN)} />
      </View>
    </View>
  );

  return (
    <FlatList 
      style={styles.container}
      data={filteredNutrients}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<Text style={styles.emptyText}>No nutrient plan available.</Text>}
      renderItem={({ item }) => (
        <NutrientCard nutrient={item} />
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
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 10,
  },
  filterList: {
    marginVertical: 10,
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 10,
  }
})
