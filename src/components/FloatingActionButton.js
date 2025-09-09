import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const FloatingActionButton = ({ navigation, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    animation.value = withSpring(toValue, {
      damping: 15,
      stiffness: 150,
    });
    setIsOpen(!isOpen);
  };

  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(animation.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    pointerEvents: animation.value > 0 ? 'auto' : 'none',
  }));

  const actionButtonStyle = (index, totalButtons) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        animation.value,
        [0, 1],
        [0, -(60 * (totalButtons - index))]
      );
      const opacity = interpolate(animation.value, [0, 0.5, 1], [0, 0.5, 1]);
      const scale = interpolate(animation.value, [0, 1], [0.3, 1]);

      return {
        transform: [
          { translateY },
          { scale },
        ],
        opacity,
      };
    });
  };

  const actions = [
    {
      icon: 'add-circle-outline',
      label: 'Add Service',
      color: '#34D399',
      onPress: () => navigation.navigate('ServiceProviderRegistration'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help Center',
      color: '#F59E0B',
      onPress: () => navigation.navigate('HelpCenterPage'),
    },
    {
      icon: 'chatbubble-outline',
      label: 'Quick Chat',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Inbox'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity 
          style={styles.overlayTouch}
          onPress={toggleMenu}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <Animated.View
            key={index}
            style={[
              styles.actionButtonContainer,
              actionButtonStyle(index, actions.length),
            ]}
          >
            <View style={styles.actionLabelContainer}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => {
                toggleMenu();
                action.onPress();
              }}
            >
              <Icon name={action.icon} size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Main FAB */}
      <Animated.View style={[styles.fab, { backgroundColor: colors.primary }, fabStyle]}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={toggleMenu}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Above the tab bar
    right: 20,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: -height,
    left: -width + 20,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlayTouch: {
    flex: 1,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionLabelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingActionButton;
