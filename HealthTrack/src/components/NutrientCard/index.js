import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NutrientCard = ({ nutrient }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nutrient.meal}</Text>
      <Text style={styles.type}>{nutrient.type}</Text>
      <View style={styles.nutrientInfoContainer}>
        <Text style={styles.nutrientInfo}>{nutrient.calories} cal</Text>
        <Text style={styles.nutrientInfo}>{nutrient.protein}g protein</Text>
      </View>
      <View style={styles.nutrientInfoContainer}>
        <Text style={styles.nutrientInfo}>{nutrient.carbs}g carbs</Text>
        <Text style={styles.nutrientInfo}>{nutrient.fats}g fats</Text>
      </View>
    </View>
  )
}

export default NutrientCard

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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
  nutrientInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  nutrientInfo: {
    fontSize: 12,
    color: '#333',
  },
})