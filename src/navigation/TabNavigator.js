import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';

// Import Screens
import EnhancedHomePage from '../screens/EnhancedHomePage';
import BookingsScreen from '../screens/BookingsScreen';
import InboxScreen from '../screens/InboxScreen';
import ProfilePage from '../screens/ProfilePage';
import AdminDashboard from '../screens/AdminDashboard';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;
    const isHome = routeName === 'Home';

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Bookings':
        iconName = focused ? 'calendar' : 'calendar-outline';
        break;
      case 'Inbox':
        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'Admin':
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = 'circle';
    }

    if (isHome) {
      return (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: focused ? color : color + '20',
          borderRadius: 30,
          width: 60,
          height: 50,
          marginTop: -10,
          elevation: focused ? 8 : 2,
          shadowColor: color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: focused ? 0.3 : 0.1,
          shadowRadius: 4,
        }}>
          <Icon 
            name={iconName} 
            size={32} 
            color={focused ? '#ffffff' : color} 
          />
        </View>
      );
    }

    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
        <Icon name={iconName} size={26} color={color} />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text + '60',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      })}
    >
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          tabBarBadge: null,
        }}
      />
      <Tab.Screen 
        name="Inbox" 
        component={InboxScreen}
        options={{
          tabBarBadge: null,
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={EnhancedHomePage}
        options={{
          tabBarBadge: null,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage}
        options={{
          tabBarBadge: null,
        }}
      />
      {user?.isAdmin && (
        <Tab.Screen 
          name="Admin" 
          component={AdminDashboard}
          options={{
            tabBarBadge: null,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
