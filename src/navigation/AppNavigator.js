import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { enableScreens } from 'react-native-screens';

// Enable react-native-screens for better performance
enableScreens();

// Import Screens
import LandingPage from "../screens/LandingPage";
import SignInPage from "../screens/SignInPage";
import SignUpPage from "../screens/SignUpPage";
import ForgotPasswordPage from "../screens/ForgotPasswordPage";
import SpecialOffers from "../screens/SpecialOffers";
import FillProfilePage from "../screens/FillProfile";
import ChatScreen from "../screens/ChatScreen";
import ServiceProviderRegistration from "../screens/ServiceProviderRegistration";
import ServiceDetails from "../screens/ServiceDetails";
import SubmitReview from "../screens/SubmitReview";
import PrivacyPolicyPage from "../screens/PrivacyPolicyPage";
import HelpCenterPage from "../screens/HelpCenterPage";
import FAQAnswerScreen from '../screens/FAQAnswerScreen';
import BookingDetails from "../screens/BookingDetails";
import CreateTicket from "../screens/CreateTicket";

// Import Navigation Components
import TabNavigator from "./TabNavigator";
import LoadingScreen from "../components/LoadingScreen";

// Import User Context
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);
  const { colors } = useContext(ThemeContext);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Simulate loading user data
  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoaded(true);
    }
  }, [user]);

  // Enhanced loading screen
  if (!isUserLoaded) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }} 
        initialRouteName="Landing"
      >
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        
        {/* Main App with Tab Navigation */}
        <Stack.Screen name="MainApp" component={TabNavigator} />
        
        {/* Modal Screens */}
        <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
        <Stack.Screen name="FillProfile" component={FillProfilePage} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ServiceProviderRegistration" component={ServiceProviderRegistration} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="SubmitReview" component={SubmitReview} />
        <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} />
        <Stack.Screen name="HelpCenterPage" component={HelpCenterPage} />
        <Stack.Screen name="FAQAnswer" component={FAQAnswerScreen} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
        <Stack.Screen name="CreateTicket" component={CreateTicket} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
