import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const WelcomeCard = ({ name }) => {

  const colors = useSelector((state) => state.theme.colors);
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}! 👋</Text>
      <Text style={styles.subtitle}>Let's crush today's goals!</Text>
    </View>
  )
}

export default React.memo(WelcomeCard);

const getStyles = (colors) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.welcomeCard,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.welcomeCardText,
  },
  subtitle: {
    fontSize: 14,
    color: colors.welcomeCardText,
  },
})