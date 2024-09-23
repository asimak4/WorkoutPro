import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import WorkoutCardDisplay from '../WorkoutTableComponent/WorkoutCardCalView';
import { StackScreenProps } from '@react-navigation/stack';
import { USERNAME } from '../HomeScreen/HomeScreen';

interface WorkoutDay {
  day: string;
  exercises: any[];
}

interface WorkoutBlock {
  block: string;
  weeks: { days: WorkoutDay[] }[];
}

type RootStackParamList = {
  Home: undefined;
  Calendar: { workoutData: WorkoutBlock[] };
  CurrentWorkout: { selectedWorkout: WorkoutDay | null; selectedDate: string; workoutData: WorkoutBlock[]; markedDates: { [key: string]: any } };
};

type CalendarScreenProps = StackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen: React.FC<CalendarScreenProps> = ({ route, navigation }) => {
  const { workoutData } = route.params;

  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (date: Date) => {
    setStartDate(date);
    hideDatePicker();

    try {
      const response = await axios.get('http://localhost:5000/api/workout/' + USERNAME);
      const workoutData = response.data.data;

      parseWorkoutsIntoCalendar(date, workoutData);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
      Alert.alert('Error', 'There was an issue fetching your workout plan.');
    }
  };

  const parseWorkoutsIntoCalendar = (start: Date, workoutData: WorkoutBlock[]) => {
    const workoutDates: { [key: string]: any } = {};
    let currentDate = new Date(start);

    workoutData.forEach((block) => {
      block.weeks.forEach((week) => {
        week.days.forEach((day: WorkoutDay) => {
          const formattedDate = currentDate.toISOString().split('T')[0];

          workoutDates[formattedDate] = {
            marked: true,
            dotColor: day.day.includes('Rest') ? 'red' : 'blue',
            workout: day,
          };

          currentDate.setDate(currentDate.getDate() + 1);
        });
      });
    });

    const today = new Date().toISOString().split('T')[0];
    setMarkedDates({ ...workoutDates, [today]: { ...workoutDates[today], selected: true } });
    setSelectedWorkout(workoutDates[today]?.workout || null);
  };

  const handleDayPress = (day: any) => {
    const formattedDate = day.dateString;
    setSelectedDate(formattedDate);
    setSelectedWorkout(markedDates[formattedDate]?.workout || null);

    const updatedMarkedDates = Object.keys(markedDates).reduce((acc, date) => {
      acc[date] = { ...markedDates[date], selected: date === formattedDate };
      return acc;
    }, {} as { [key: string]: any });

    setMarkedDates(updatedMarkedDates);
  };

  const getWorkoutStartDate = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/workoutInfo/' + USERNAME);
      console.log('Response: ', response.data.startDate);
      if (response && response.data && response.data.startDate) {
        setStartDate(new Date(response.data.startDate));
        if (response.data.startDate) {
          parseWorkoutsIntoCalendar(new Date(response.data.startDate), workoutData);
        }
        console.log('Workout date received');
      } else {
        setStartDate(null);
        console.log('Issue when searching for start date.');
      }
      setFetchingData(false);
    } catch (error) {
      console.error('Error getting workout start date:', error);
    }
  };

  useEffect(() => {
    const fetchWorkoutStartDate = async () => {
      await getWorkoutStartDate();
    };

    fetchWorkoutStartDate();
  }, []);

  const saveWorkoutPlan = async () => {
    if (!startDate) {
      Alert.alert('Error', 'Please select a start date before saving the workout plan.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/save-workout/', {
        userId: USERNAME,
        startDate: startDate.toISOString(),
        workoutData,
        markedDates
      });

      Alert.alert('Success', 'Workout plan saved successfully!');

      navigation.replace('CurrentWorkout', { selectedWorkout, selectedDate, workoutData, markedDates });
    } catch (error) {
      console.error('Error saving workout plan:', error);
      Alert.alert('Error', 'There was an issue saving your workout plan.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Workout Calendar</Text>
      {fetchingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <ScrollView>
          {!startDate ? (
            <>
              <Button title="Choose Start Date" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </>
          ) : (
            <>
              <Text style={styles.header}>Review Your Workout Plan</Text>
              <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={{
                  selectedDayBackgroundColor: '#2196F3',
                  todayTextColor: '#2196F3',
                  dotColor: '#50C878',
                }}
              />

              <View style={styles.buttonContainer}>
                <Button title="Change Start Date" onPress={showDatePicker} />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                <Button title="Save Workout Plan" onPress={saveWorkoutPlan} />
              </View>

              {selectedWorkout ? (
                <View style={styles.workoutContainer}>
                  <Text style={styles.workoutTitle}>Workout for {selectedDate}:</Text>
                  <Text style={styles.workoutText}>Day: {selectedWorkout.day}</Text>
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 ? (
                    selectedWorkout.exercises.map((exercise, index) => (
                      <WorkoutCardDisplay key={index} exercise={exercise} />
                    ))
                  ) : (
                    <Text style={styles.noExercisesText}>No exercises for this day.</Text>
                  )}
                </View>
              ) : (
                <Text style={styles.noWorkoutText}>No workout scheduled for this day.</Text>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  workoutContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
    color: '#424242',
  },
  noExercisesText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginTop: 20,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
});

export default CalendarScreen;
