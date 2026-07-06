import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const SectionHeader = ({ text, subtitle }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

export default React.memo(SectionHeader);

const getStyles = (colors) => StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
})