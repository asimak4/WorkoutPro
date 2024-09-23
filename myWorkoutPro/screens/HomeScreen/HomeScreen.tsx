import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, View, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export interface WorkoutBlock {
  block: string;
  weeks: any[];
}

export const USERNAME = 'testUser4';

const HomeScreen: React.FC<{ username?: string }> = ({ username = USERNAME }) => {
  const [fileName, setFileName] = useState<string>('');
  const [fileData, setFileData] = useState<WorkoutBlock[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingWorkoutData, setFetchingWorkoutData] = useState(true);

  const navigation = useNavigation<HomeScreenNavigationProp>(); // Use the typed navigation

  const getWorkoutUserInfo = async (username: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/workoutInfo/' + username);
      console.log('Response: ', response.data);
      if (response && response.data && response.data) {
        const selectedDate = String(new Date().toISOString().split('T')[0]);
        const workoutData = response.data.workoutData;
        const markedDates = response.data?.markedDates;
        if(markedDates){
            console.log("Marked Dates: ", markedDates);
            const selectedWorkout = markedDates[0][selectedDate]?.workout;
            console.log("Selected Workout: ", selectedWorkout);
            navigation.replace('CurrentWorkout', { selectedWorkout, selectedDate, workoutData, markedDates });
        }else {
            console.log("Data: ", response.data);
            navigation.replace('Calendar', { workoutData });
        }
        console.log('Workout date received');
      } else {
        console.log('Issue when searching for start date.');
      }
    } catch (error) {
      setFetchingWorkoutData(false);
      console.error('Error getting workout start date:', error);
    }
  };

  useEffect(() => {
    const fetchWorkoutStartDate = async () => {
      await getWorkoutUserInfo(USERNAME);
    };

    fetchWorkoutStartDate();
  }, []);


  const handleFilePicker = async () => {
    try {
        const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.allFiles],
        });

        if (result) {
            setLoading(true);
            setFileName(result.name || '');

            // Fetch the file content as a Blob
            const response = await fetch(result.uri);
            const blob = await response.blob();

            const formData = new FormData();
            // Append the file to the formData
            //@ts-ignore
            formData.append('file', {
                uri: result.uri,
                name: result.name || 'file',
                type: result.type || 'application/octet-stream' // Fallback to generic binary type
            });
            // Append the userId to the formData
            formData.append('userId', USERNAME);

            const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (uploadResponse.status === 200) {
                Alert.alert('Success', 'File successfully uploaded!');
                setFileData(uploadResponse.data.data); // Assuming the response contains the workout data

                // Navigate to the CalendarScreen and pass the workout data
                navigation.replace('Calendar', { workoutData: uploadResponse.data.data });
            } else {
                Alert.alert('Error', 'File upload failed!');
            }
        }
    } catch (err: any) {
        if (DocumentPicker.isCancel(err)) {
            Alert.alert('Cancelled', 'File selection was cancelled');
        } else {
            console.error('File Picker Error: ', err);
            Alert.alert('Error', `An error occurred: ${err.message}`);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {!fetchingWorkoutData ? (
          <>
            <Card style={styles.card}>
              <Card.Title title={`Welcome, ${username}`} titleStyle={styles.titleStyle} />
              <Card.Content>
                <Button title="Upload Workout File" onPress={handleFilePicker} />
              </Card.Content>
            </Card>
  
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Processing file, please wait...</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderColor: '#ddd',
  },
  titleStyle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#212121',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
});

export default HomeScreen;
