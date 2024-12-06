import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingPage from '../screens/LandingPage';
import SignInPage from '../screens/SignInPage';
import SignUpPage from '../screens/SignUpPage';
import ForgotPasswordPage from '../screens/ForgotPasswordPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header for all pages
        }}
      >
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
