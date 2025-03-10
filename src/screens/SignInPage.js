import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native-animatable';
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message'; // Toast for notifications

import logo from '../assets/logo.png';
import { UserContext } from '../context/UserContext';

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const { setUser } = useContext(UserContext);

  const handleSignIn = async () => {
    // Validation checks
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in both email and password',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Toast.show({
          type: 'info',
          text1: 'Email Not Verified',
          text2: 'Please verify your email before signing in.',
        });
        setLoading(false);
        return;
      }

      // Set user context
      setUser(user);

      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: `Logged in as ${user.email}`,
      });

      // Navigate to Home and reset the navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'HomePage' }],
        })
      );
    } catch (error) {
      let errorMsg = 'An error occurred during sign-in.';

      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many attempts. Try again later.';
      }

      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FF7E5F', '#FD3A69']} style={styles.container}>
      <Image source={logo} style={styles.logo} animation="bounceIn" duration={1500} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#FF416C',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 15,
  },
});

export default SignInPage;
