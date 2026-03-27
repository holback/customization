import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE } from '../constants/colors';

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.32;

export default function SplashScreen({ navigation, initialRoute }) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Logo entra con spring + fade
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 12,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 2. Titolo sale e appare
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 3. Sottotitolo e dot decorativo
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(dotScale, {
          toValue: 1,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace(initialRoute || 'Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, initialRoute, logoScale, logoOpacity, titleTranslateY, titleOpacity, subtitleOpacity, dotScale]);

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Cerchi decorativi di sfondo */}
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />
      <View style={[styles.bgCircle, styles.bgCircle3]} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
        }}
      >
        <Text style={styles.title}>Menu Settimanale</Text>
      </Animated.View>

      {/* Dot decorativo */}
      <Animated.View
        style={[styles.dot, { transform: [{ scale: dotScale }] }]}
      />

      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Organizza i tuoi pasti con facilità
      </Animated.Text>

      {/* Versione in basso */}
      <Animated.Text style={[styles.version, { opacity: subtitleOpacity }]}>
        v1.0.0
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Cerchi decorativi
  bgCircle: {
    position: 'absolute',
    borderRadius: LOGO_SIZE * 3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  bgCircle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: -width * 0.1,
    left: -width * 0.2,
  },
  bgCircle3: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: width * 0.3,
    right: -width * 0.1,
  },
  logoContainer: {
    marginBottom: SPACING.xxxl,
  },
  logoOuter: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoInner: {
    width: LOGO_SIZE * 0.78,
    height: LOGO_SIZE * 0.78,
    borderRadius: (LOGO_SIZE * 0.78) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 52,
  },
  title: {
    fontSize: FONT_SIZE.display,
    fontWeight: '800',
    color: COLORS.textLight,
    letterSpacing: -0.5,
    marginBottom: SPACING.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: SPACING.huge,
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
});
