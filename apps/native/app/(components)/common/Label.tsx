import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

interface LabelProps {
  children: React.ReactNode
  style?: TextStyle
  disabled?: boolean
}

const Label: React.FC<LabelProps> = ({ children, style, disabled }) => {
  return (
    <Text style={[styles.label, disabled && styles.disabled, style]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    lineHeight: 18, // leading-none (approx for text-sm)
    color: 'rgb(250, 250, 250)', // default text color (e.g., gray-900)
    paddingBottom: 8,
  },
  disabled: {
    opacity: 0.7,
  },
})

export default Label
