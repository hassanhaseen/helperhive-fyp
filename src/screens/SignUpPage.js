import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Use expo-linear-gradient
import { Image } from 'react-native-animatable'; // Animatable Image
import logo from '../assets/logo.png';

const { width } = Dimensions.get('window');

const SignUpPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Sign up with:', name, email, password);
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
      <Text style={styles.title}>Create Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.signinContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signinText}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
    borderRadius: width * 0.2,
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
  signinContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  signinText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignUpPage;
