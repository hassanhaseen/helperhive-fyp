import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ServiceCard = ({ 
  service, 
  index, 
  onPress, 
  colors,
  getCategoryIcon,
  getCategoryColor 
}) => {
  const gradientColors = [
    getCategoryColor(service.category) + '10',
    getCategoryColor(service.category) + '05',
    'transparent'
  ];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        {/* Background Gradient */}
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[
            styles.categoryBadge, 
            { backgroundColor: getCategoryColor(service.category) + '20' }
          ]}>
            <Icon 
              name={getCategoryIcon(service.category)} 
              size={14} 
              color={getCategoryColor(service.category)} 
            />
            <Text style={[
              styles.categoryText, 
              { color: getCategoryColor(service.category) }
            ]}>
              {service.category}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.currency, { color: colors.primary }]}>PKR</Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              {service.priceRange}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {service.serviceName}
          </Text>
          
          <Text style={[
            styles.description, 
            { color: colors.text + '80' }
          ]} numberOfLines={3}>
            {service.description}
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.locationInfo}>
            <Icon name="location-outline" size={12} color={colors.text + '60'} />
            <Text style={[styles.locationText, { color: colors.text + '60' }]}>
              {service.city}
            </Text>
          </View>
          
          <View style={styles.statusInfo}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.statusText, { color: '#10B981' }]}>
              Available
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionButton}>
          <TouchableOpacity 
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={onPress}
          >
            <Text style={styles.bookText}>Book Now</Text>
            <Icon name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  touchable: {
    padding: 16,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  content: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    alignItems: 'flex-end',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
});

export default ServiceCard;
