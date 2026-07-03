import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const Loader = ({ text }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);  

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={colors.primary} />
        {text && <Text style={styles.loadingText}>{text}</Text>}
      </View>
    </View>
  )
}

export default Loader

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    minWidth: 120,
    height: 120,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
  },
});
