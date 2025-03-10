import React, { useEffect, useState } from 'react';
import { StatusBar, View, AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { AppProvider } from './src/context/AppContext';
import { UserProvider } from './src/context/UserContext';
import { ThemeProvider } from './src/context/ThemeContext'; // Already imported
import { auth, db } from './src/firebase'; // Add your correct firebase path
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      const user = auth.currentUser;

      if (!user) {
        console.log('No authenticated user');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      if (nextAppState === 'active') {
        // App is in foreground
        await updateDoc(userDocRef, {
          isOnline: true,
        });
        console.log('User is online');
      } else {
        // App in background or closed
        await updateDoc(userDocRef, {
          isOnline: false,
          lastSeen: serverTimestamp(),
        });
        console.log('User is offline');
      }

      setAppState(nextAppState);
    };

    // Add AppState listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <UserProvider>
      <AppProvider>
        <ThemeProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <AppNavigator />
            <Toast />
          </View>
        </ThemeProvider>
      </AppProvider>
    </UserProvider>
  );
}
