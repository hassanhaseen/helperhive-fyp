import React, { useContext } from "react";
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

// Import User Context
import { UserContext } from "../context/UserContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated User Screens
          <>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
            <Stack.Screen name="FillProfile" component={FillProfilePage} />
            <Stack.Screen name="Inbox" component={InboxScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen
              name="ServiceProviderRegistration"
              component={ServiceProviderRegistration}
            />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
          </>
        ) : (
          // Unauthenticated User Screens (Authentication Flow)
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="SignIn" component={SignInPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordPage}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
