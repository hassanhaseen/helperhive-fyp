import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase auth methods
import { LinearGradient } from 'expo-linear-gradient'; // expo-linear-gradient
import { Image } from 'react-native-animatable'; // Animatable Image
import logo from '../assets/logo.png'; // Import the logo

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const auth = getAuth(); // Initialize auth

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Use the correct method
      alert('Password reset email sent!');
      navigation.navigate('SignIn'); // Redirect to SignIn page after email is sent
    } catch (error) {
      console.error(error.message);
      alert(error.message);
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
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
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
