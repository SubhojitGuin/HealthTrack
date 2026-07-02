import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const FilterButton = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[ styles.filterButton, isSelected && styles.activeFilterButton ]}
      onPress={onPress}
    >
      <Text style={[ styles.filterText, isSelected && styles.activeFilterText ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  )
}

export default FilterButton

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  filterText: {
    color: "#000",
    fontWeight: "bold",
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
  },
  activeFilterText: {
    color: "#fff",
  },
})