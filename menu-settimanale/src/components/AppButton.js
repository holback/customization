import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOWS } from '../constants/colors';

export default function AppButton({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          isOutline ? styles.buttonOutline : styles.buttonPrimary,
          isDisabled && styles.buttonDisabled,
          SHADOWS.md,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator
            color={isOutline ? COLORS.primary : COLORS.textLight}
            size="small"
          />
        ) : (
          <Text
            style={[
              styles.text,
              isOutline ? styles.textOutline : styles.textPrimary,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg + 2,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: COLORS.textLight,
  },
  textOutline: {
    color: COLORS.primary,
  },
});
