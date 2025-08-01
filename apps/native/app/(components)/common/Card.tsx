// components/Card.tsx
import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

// Base HSL -> RGBA approximation for React Native (manual conversion)
const colors = {
  card: 'hsl(240, 10%, 3.9%)',
  cardForeground: 'hsl(0, 0%, 98%)',
  border: 'hsl(240, 3.7%, 15.9%)',
  mutedForeground: 'hsl(240, 5%, 64.9%)',
}

type CardProps = {
  children: React.ReactNode
  style?: ViewStyle
}

export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>
}

export const CardHeader = ({ children, style }: CardProps) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>
}

export const CardTitle = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: TextStyle
}) => {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>
}

export const CardDescription = ({
  children,
  style,
}: {
  children: React.ReactNode
  style?: TextStyle
}) => {
  return <Text style={[styles.cardDescription, style]}>{children}</Text>
}

export const CardContent = ({ children, style }: CardProps) => {
  return <View style={[styles.cardContent, style]}>{children}</View>
}

export const CardFooter = ({ children, style }: CardProps) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 6,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cardForeground,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
})
