import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen, { WorkoutBlock } from './screens/HomeScreen/HomeScreen';
import CalendarScreen from './screens/WorkoutCalendar/WorkoutCalendar';
import CurrentWorkoutScreen from './screens/CurrentWorkoutScreen/CurrentWorkoutScreen'; // Assuming you have this screen
// types.ts
export type RootStackParamList = {
  Home: undefined;
  Calendar: { workoutData: any }; // Define the exact type for workoutData if possible
  CurrentWorkout: { selectedWorkout: any; selectedDate: string; workoutData?: WorkoutBlock[]; markedDates?: any }; // Updated type definition
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false, headerLeft: undefined , headerShown: false}} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ gestureEnabled: false, headerLeft: undefined, headerShown: false }} />
        <Stack.Screen name="CurrentWorkout" component={CurrentWorkoutScreen} options={{ gestureEnabled: false, headerLeft: undefined, headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
