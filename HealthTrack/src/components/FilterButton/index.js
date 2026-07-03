import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const FilterButton = ({ item, isSelected, onPress }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

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

const getStyles = (colors) => StyleSheet.create({
  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
    elevation: 2,
  },
  filterText: {
    color: colors.text,
    fontWeight: "bold",
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  activeFilterText: {
    color: colors.textOnPrimary,
  },
})