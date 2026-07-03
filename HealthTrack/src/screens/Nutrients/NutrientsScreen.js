import { FlatList, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import { DASHBOARD_SCREEN, WORKOUT_SCREEN } from '../../navigation/routes'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchNutritionPlans } from '../../api/fitnessService';
import { setNutritionPlans } from '../../store/slices/workoutSlice';
import Button from '../../components/Button';
import FilterButton from '../../components/FilterButton';
import NutrientCard from '../../components/NutrientCard';
import Input from '../../components/Input';
import useDebounce from '../../hooks/useDebounce';
import Loader from '../../components/Loader';

const nutritionPlanTypes = [
  { label: "All", value: "" },
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snack", value: "Snack" },
];

const ScreenHeader = ({ searchQuery, setSearchQuery, selectedPlanType, handlePlanTypeChange }) => {
  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);
  return (
    <View style={styles.headerContainer}>
      <SectionHeader text="Nutrient Plans" subtitle="Track your daily meals" />

      <Input 
        placeholder="Search meals..." 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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
};

export default function NutrientsScreen({ navigation }) {
  
  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  const dispatch = useDispatch();
  
  const storeNutritionPlans = useSelector((state) => state.workout.nutritionPlans) || [];

  const [ selectedPlanType, setSelectedPlanType ] = React.useState("");
  const [ searchQuery, setSearchQuery ] = React.useState(""); 
  const [ filteredNutrients, setFilteredNutrients ] = React.useState([]);
  const [ isLoading, setIsLoading ] = React.useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  React.useEffect(() => {
    if (storeNutritionPlans.length === 0) {
      fetchNutritionPlans().then(plans => {
        dispatch(setNutritionPlans({ plans }));
        setIsLoading(false);
      }).catch(error => {
        console.error("Failed to fetch nutrition plans:", error);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, storeNutritionPlans.length]); 

  React.useEffect(() => {
    const filtered = storeNutritionPlans.filter(nutrient => {
      const matchesType = selectedPlanType ? nutrient.type === selectedPlanType : true;
      
      const matchesSearch = nutrient.meal ? nutrient.meal.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) : false;
      return matchesType && matchesSearch;
    });
    setFilteredNutrients(filtered);
  }, [selectedPlanType, storeNutritionPlans, debouncedSearchQuery]);

  const handlePlanTypeChange = (type) => {
    setSelectedPlanType(type);
  };

  if (isLoading) {
    return (
      <Loader text="Loading nutrient plans..." />
    );
  }

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.buttonContainer}>
        <Button title="Go to Dashboard" onPress={() => navigation.navigate(DASHBOARD_SCREEN)} />
        <Button title="Go to Workouts" onPress={() => navigation.navigate(WORKOUT_SCREEN)} />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList 
        style={styles.container}
        data={filteredNutrients}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        ListHeaderComponent={
          <ScreenHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPlanType={selectedPlanType}
            handlePlanTypeChange={handlePlanTypeChange}
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text style={styles.emptyText}>No nutrient plan available.</Text>}
        renderItem={({ item }) => (
          <NutrientCard nutrient={item} />
        )}
      />
    </KeyboardAvoidingView>
  )
}

const getStyles = (colors) => StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, 
    backgroundColor: colors.background,
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
    color: colors.textSecondary,
  }
})
