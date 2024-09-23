import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, Button, StyleSheet } from 'react-native';
import WorkoutCard from './WorkoutCard';

interface WorkoutTableProps {
  fileData: any[]; // Update this type based on the data structure
}

interface SetInputProps {
  setNumber: number;
  weight: string;
  reps: string;
}

const WorkoutTableComponent: React.FC<WorkoutTableProps> = ({ fileData }) => {
  return (
    <ScrollView style={styles.container}>
      {fileData &&
        fileData.map((block, blockIndex) => (
          <View key={blockIndex}>
            <Text style={styles.blockTitle}>{block.block}</Text>

            {block.weeks.map((week: any, weekIndex: number) => (
              <View key={weekIndex}>
                <Text style={styles.weekTitle}>{week.week}</Text>

                {week.days.map((day: any, dayIndex: number) => (
                  <View key={dayIndex}>
                    <Text style={styles.dayTitle}>{day.day}</Text>

                    {day.exercises.map((exercise: any, exerciseIndex: number) => (
                      <WorkoutCard key={exerciseIndex} exercise={exercise} />
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setText: {
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 10,
    width: 80,
  },
  notesSection: {
    marginTop: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default WorkoutTableComponent;
