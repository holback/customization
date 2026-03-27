import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOWS } from '../constants/colors';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import Divider from '../components/Divider';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrors({});
  };

  const toggleMode = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLogin(!isLogin);
      clearForm();
      slideAnim.setValue(10);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato email non valido';
    }

    if (!password.trim()) {
      newErrors.password = 'Password obbligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'Minimo 6 caratteri';
    }

    if (!isLogin) {
      if (!name.trim()) newErrors.name = 'Nome obbligatorio';
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Le password non corrispondono';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFirebaseErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Questa email è già registrata.',
      'auth/invalid-email': 'Email non valida.',
      'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
      'auth/user-not-found': 'Nessun account trovato con questa email.',
      'auth/wrong-password': 'Password errata.',
      'auth/invalid-credential': 'Credenziali non valide.',
      'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
    };
    return errorMessages[errorCode] || 'Si è verificato un errore. Riprova.';
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
        });
      }
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Errore', getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Inserisci la tua email prima' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Email inviata',
        'Controlla la tua casella email per reimpostare la password.'
      );
    } catch (error) {
      Alert.alert('Errore', getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header con logo */}
          <View style={styles.header}>
            <View style={styles.logoMini}>
              <Text style={styles.logoEmoji}>🍽️</Text>
            </View>
            <Text style={styles.appName}>Menu Settimanale</Text>
          </View>

          {/* Card del form */}
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>
              {isLogin ? 'Bentornato!' : 'Crea il tuo account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Accedi per gestire i tuoi menu'
                : 'Registrati per iniziare a pianificare'}
            </Text>

            {!isLogin && (
              <AppInput
                label="Nome"
                icon="👤"
                placeholder="Il tuo nome"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                autoCapitalize="words"
                editable={!loading}
                error={errors.name}
              />
            )}

            <AppInput
              label="Email"
              icon="✉️"
              placeholder="email@esempio.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              error={errors.email}
            />

            <AppInput
              label="Password"
              icon="🔒"
              placeholder="Minimo 6 caratteri"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              editable={!loading}
              error={errors.password}
            />

            {!isLogin && (
              <AppInput
                label="Conferma Password"
                icon="🔒"
                placeholder="Ripeti la password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: null });
                }}
                secureTextEntry
                editable={!loading}
                error={errors.confirmPassword}
              />
            )}

            <AppButton
              title={isLogin ? 'Accedi' : 'Crea Account'}
              onPress={handleSubmit}
              loading={loading}
              style={{ marginTop: SPACING.sm }}
            />

            {isLogin && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>
                  Password dimenticata?
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Footer: toggle login/registrazione */}
          <Divider text="oppure" />

          <AppButton
            title={isLogin ? 'Crea un nuovo account' : 'Ho già un account'}
            onPress={toggleMode}
            variant="outline"
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoMini: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: {
    fontSize: 28,
  },
  appName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    lineHeight: 20,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
