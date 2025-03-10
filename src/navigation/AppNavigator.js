import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import Screens
import LandingPage from "../screens/LandingPage";
import SignInPage from "../screens/SignInPage";
import SignUpPage from "../screens/SignUpPage";
import ForgotPasswordPage from "../screens/ForgotPasswordPage";
import HomePage from "../screens/HomePage";
import ProfilePage from "../screens/ProfilePage";
import SpecialOffers from "../screens/SpecialOffers";
import FillProfilePage from "../screens/FillProfile";
import InboxScreen from "../screens/InboxScreen";
import ChatScreen from "../screens/ChatScreen";
import ServiceProviderRegistration from "../screens/ServiceProviderRegistration";
import ServiceDetails from "../screens/ServiceDetails";
import BookingsScreen from "../screens/BookingsScreen";
import SubmitReview from "../screens/SubmitReview";
import AdminDashboard from "../screens/AdminDashboard";
import PrivacyPolicyPage from "../screens/PrivacyPolicyPage";
import HelpCenterPage from "../screens/HelpCenterPage";
import FAQAnswerScreen from '../screens/FAQAnswerScreen';


// Import User Context
import { UserContext } from "../context/UserContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Simulate loading user data
  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoaded(true);
    }
  }, [user]);

  if (!isUserLoaded) {
    // Optional: show a splash or loading screen
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
        <Stack.Screen name="FillProfile" component={FillProfilePage} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ServiceProviderRegistration" component={ServiceProviderRegistration} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
        <Stack.Screen name="SubmitReview" component={SubmitReview} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="PrivacyPolicyPage" component={PrivacyPolicyPage} />
        <Stack.Screen name="HelpCenterPage" component={HelpCenterPage} />
        <Stack.Screen name="FAQAnswer" component={FAQAnswerScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
