import React, { useContext } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';

const FAQAnswerScreen = ({ route, navigation }) => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const { question, answer } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
          }}
        >
          {question}
        </Text>
      </View>

      <ScrollView style={{ paddingHorizontal: 15 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>{answer}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQAnswerScreen;
