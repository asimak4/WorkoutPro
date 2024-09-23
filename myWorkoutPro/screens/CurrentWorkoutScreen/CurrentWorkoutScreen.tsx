import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import WorkoutCard from '../WorkoutTableComponent/WorkoutCard'; 
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { USERNAME } from '../HomeScreen/HomeScreen';
import axios from 'axios';

interface WorkoutDay {
  day: string;
  exercises: any[];
}

interface WorkoutBlock {
  block: string;
  weeks: { days: WorkoutDay[] }[];
}

interface CurrentWorkoutScreenProps {
  route: any;
  navigation: any;
}

const CurrentWorkoutScreen: React.FC<CurrentWorkoutScreenProps> = ({ route, navigation }) => {
  const { workoutData, markedDates } = route.params;
  const [currentDate, setCurrentDate] = useState(route.params.selectedDate);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDay | null>(route.params.selectedWorkout);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [timer, setTimer] = useState<string>('00:00:00');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
    hideDatePicker();

    const newSelectedWorkout = markedDates[formattedDate]?.workout || null;
    setSelectedWorkout(newSelectedWorkout);

    navigation.replace('CurrentWorkout', { selectedWorkout: newSelectedWorkout, selectedDate: formattedDate, workoutData, markedDates });
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(new Date());
  };

  const endWorkout = async () => {
    const workoutEndTime = new Date();
    const duration = (workoutEndTime.getTime() - (workoutStartTime?.getTime() || 0)) / 1000;
    
    try {
      await axios.post('http://localhost:5000/api/save-workout', {
        userId: USERNAME,  // Replace with dynamic user ID if available
        workoutDate: currentDate,
        markedDates: markedDates,
        workoutData: selectedWorkout,
        duration, // Total workout duration in seconds
      });

    //   Alert.alert('Workout Saved', 'Your workout has been saved successfully!');
    //   navigation.navigate('Calendar', { workoutData });
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'There was an issue saving your workout.');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkoutActive && workoutStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsedTime = now.getTime() - workoutStartTime.getTime();
        const hours = String(Math.floor(elapsedTime / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((elapsedTime % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, '0');
        setTimer(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive, workoutStartTime]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout for {currentDate}</Text>
        {!isWorkoutActive && (
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Change Date</Text>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.buttonContainerTop}>
          {!isWorkoutActive ? (
            <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timer}>Timer: {timer}</Text>
          )}
        </View>

        <Text style={styles.workoutDayText}>{selectedWorkout?.day}</Text>

        {selectedWorkout && selectedWorkout.exercises && selectedWorkout.exercises.length > 0 ? (
          selectedWorkout.exercises.map((exercise: any, index: number) => (
            <WorkoutCard key={index} exercise={exercise} />
          ))
        ) : (
          <Text style={styles.noWorkoutText}>No exercises scheduled for this day.</Text>
        )}

        <View style={styles.buttonContainer}>
          {isWorkoutActive && (
            <TouchableOpacity style={styles.endButton} onPress={endWorkout}>
              <Text style={styles.endButtonText}>End Workout</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.calendarButton} onPress={() => navigation.navigate('Calendar', { workoutData })}>
            <Text style={styles.calendarButtonText}>View Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollViewContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f00',
    textAlign: 'center',
    marginTop: 10,
  },
  workoutDayText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainerTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  calendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CurrentWorkoutScreen;
