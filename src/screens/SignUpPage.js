import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
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

import { auth } from '../firebase';
import logo from '../assets/logo.png';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

const SignUpPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const db = getFirestore();

  const handleSignUp = async () => {
    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields.',
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

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters long.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords Do Not Match',
        text2: 'Please make sure both passwords match.',
      });
      return;
    }

    try {
      setLoading(true);

      // Firebase Authentication - Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'customer', // or 'provider' if you add logic
        createdAt: new Date(),
      });

      // Don't setUser(user) because we are not logging in yet
      Toast.show({
        type: 'success',
        text1: 'Registration Successful!',
        text2: 'Please check your inbox to verify your email before signing in.',
      });

      // Navigate back to SignIn page (use correct route name!)
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
    <LinearGradient colors={['#FF7E5F', '#FD3A69']} style={styles.container}>
      <Image source={logo} style={styles.logo} animation="bounceIn" duration={1500} />

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
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

export default SignUpPage;
