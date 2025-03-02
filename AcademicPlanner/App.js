import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import CourseSchedule from './src/screens/CourseSchedule';
import Assignments from './src/screens/Assignments';
import GradeCalculator from './src/screens/GradeCalculator';
import Reminders from './src/screens/Reminders';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Schedule: 'calendar',
              Assignments: 'list',
              Grades: 'calculator',
              Reminders: 'alarm',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          headerShown: false, // Optional: Hides the header
        })}
      >
        <Tab.Screen name="Schedule" component={CourseSchedule} />
        <Tab.Screen name="Assignments" component={Assignments} />
        <Tab.Screen name="Grades" component={GradeCalculator} />
        <Tab.Screen name="Reminders" component={Reminders} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
