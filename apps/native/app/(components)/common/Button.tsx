import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  onPress?: () => void
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  disabled,
  onPress,
}) => {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variantStyle.button,
        sizeStyle.button,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variantStyle.text,
          sizeStyle.text,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
})

const variantStyles = {
  default: {
    button: { backgroundColor: 'rgb(22, 162, 73)' }, // bg-primary
    text: { color: '#ffffff' }, // text-primary-foreground
  },
  destructive: {
    button: { backgroundColor: '#dc2626' }, // bg-destructive
    text: { color: '#ffffff' }, // text-destructive-foreground
  },
  outline: {
    button: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      backgroundColor: '#ffffff',
    }, // border-input
    text: { color: '#111827' }, // text
  },
  secondary: {
    button: { backgroundColor: '#e5e7eb' }, // bg-secondary
    text: { color: '#111827' }, // text-secondary-foreground
  },
  ghost: {
    button: { backgroundColor: 'transparent' },
    text: { color: '#111827' },
  },
  link: {
    button: { backgroundColor: 'transparent' },
    text: { color: '#1d4ed8', textDecorationLine: 'underline' },
  },
}

const sizeStyles = {
  default: {
    button: { height: 40 },
    text: {},
  },
  sm: {
    button: { height: 36, paddingHorizontal: 8 },
    text: { fontSize: 13 },
  },
  lg: {
    button: { height: 44, paddingHorizontal: 16 },
    text: { fontSize: 16 },
  },
  icon: {
    button: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {},
  },
}

export default Button
