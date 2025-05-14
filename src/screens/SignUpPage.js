import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

import { auth } from '../firebase';
import logo from '../assets/logo.png';
import { UserContext } from '../context/UserContext';

const SignUpPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = useContext(UserContext);
  const db = getFirestore();

  const isNameValid = name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword !== '';

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

  const handleSignUp = async () => {
    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'customer',
        createdAt: new Date(),
      });

      Toast.show({
        type: 'success',
        text1: 'Registration Successful!',
        text2: 'Please check your inbox to verify your email before signing in.',
      });

      navigation.navigate('SignIn');
    } catch (error) {
      console.log(error);
      let errorMsg = 'An error occurred during sign-up.';

      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      }

      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4a90e2', '#005bea']} style={styles.container}>
      <Image source={logo} style={styles.logo} animation="bounceIn" duration={1500} />

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={[styles.input, !isNameValid && name !== '' ? styles.inputError : null]}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, !isEmailValid && email !== '' ? styles.inputError : null]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, !isPasswordValid && password !== '' ? styles.inputError : null, { paddingRight: 45 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, !isConfirmPasswordValid && confirmPassword !== '' ? styles.inputError : null, { paddingRight: 45 }]}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
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
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
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
  inputError: {
    borderColor: 'red',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 15,
  },
});

export default SignUpPage;
