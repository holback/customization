import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Sostituisci con le tue credenziali Firebase
// Vai su https://console.firebase.google.com → Crea progetto → Impostazioni progetto → App web
const firebaseConfig = {
  apiKey: 'LA_TUA_API_KEY',
  authDomain: 'IL_TUO_PROGETTO.firebaseapp.com',
  projectId: 'IL_TUO_PROGETTO',
  storageBucket: 'IL_TUO_PROGETTO.appspot.com',
  messagingSenderId: 'IL_TUO_SENDER_ID',
  appId: 'IL_TUO_APP_ID',
};

const app = initializeApp(firebaseConfig);

const persistence =
  Platform.OS === 'web'
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage);

export const auth = initializeAuth(app, { persistence });

export default app;
