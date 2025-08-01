import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface IconText {
  icon?: React.ReactNode
  children: string
}

const IconText = ({ icon, children }: IconText) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.text}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgb(161, 161, 170)',
    textAlign: 'center',
  },
})

export default IconText
