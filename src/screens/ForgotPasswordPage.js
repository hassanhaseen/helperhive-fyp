import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native-animatable';
import Toast from 'react-native-toast-message';

import logo from '../assets/logo.png';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Email',
        text2: 'Please enter your email address.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent!',
        text2: 'Check your inbox for instructions to reset your password.',
      });

      // Navigate back to SignIn page
      navigation.navigate('SignIn');
    } catch (error) {
      console.error(error.message);

      let errorMsg = 'An error occurred. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Send Reset Email',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4a90e2', '#005bea']} style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        animation="bounceIn"
        delay={500}
        duration={1500}
      />

      <Text style={styles.title}>Reset Your Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.backToSignIn}>Back to Sign In</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToSignIn: {
    color: '#fff',
    marginTop: 15,
  },
});

export default ForgotPasswordPage;
