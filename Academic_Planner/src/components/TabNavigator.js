import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

import CourseSchedule from '../screens/CourseSchedule';
import Assignments from '../screens/Assignments';
import GradeCalculator from '../screens/GradeCalculator';
import Reminders from '../screens/Reminders';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      })
    );
  };

  return (
    <TouchableOpacity style={{ marginRight: 15 }} onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Schedule: 'calendar',
            Assignments: 'list',
            Grades: 'calculator',
            Reminders: 'alarm',
            Profile: 'person-outline'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerRight: () => <LogoutButton />
      })}
    >
      <Tab.Screen name="Schedule" component={CourseSchedule} />
      <Tab.Screen name="Assignments" component={Assignments} />
      <Tab.Screen name="Grades" component={GradeCalculator} />
      <Tab.Screen name="Reminders" component={Reminders} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
