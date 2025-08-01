import React from 'react'
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native'
import { colors } from '../../index'

interface InputProps extends TextInputProps {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, editable = true, ...props }, ref) => {
    return (
      <View style={[styles.wrapper, !editable && styles.disabled, style]}>
        <TextInput
          ref={ref}
          style={[styles.input, !editable && styles.inputDisabled]}
          editable={editable}
          placeholderTextColor={colors.mutedForeground}
          {...props}
        />
      </View>
    )
  }
)

Input.displayName = 'Input'

export { Input }

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 6,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    width: '100%',
  },
  input: {
    height: 40,
    fontSize: 16,
    color: colors.text,
  },
  disabled: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.inputBorder,
  },
  inputDisabled: {
    color: colors.disabledText,
  },
})
