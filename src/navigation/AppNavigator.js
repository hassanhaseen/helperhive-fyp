import React, { useState, useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LandingPage from "../screens/LandingPage";
import SignInPage from "../screens/SignInPage";
import SignUpPage from "../screens/SignUpPage";
import ForgotPasswordPage from "../screens/ForgotPasswordPage";
import HomePage from "../screens/HomePage";
import ProfilePage from "../screens/ProfilePage";
import SpecialOffers from "../screens/SpecialOffers"; // Import the SpecialOffers screen
import FillProfilePage from "../screens/FillProfile"; // Import FillProfilePage
import { UserContext } from '../context/UserContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
            <Stack.Screen name="FillProfile" component={FillProfilePage} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="SignIn" component={SignInPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
