import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WorkoutCardDisplayProps {
  exercise: {
    exercise_name: string;
    intensity: string;
    notes: string;
    reps: string;
    substitution_1?: string;
    substitution_2?: string;
    working_sets: number;
  };
}

const WorkoutCardDisplay: React.FC<WorkoutCardDisplayProps> = ({ exercise }) => {
  return (
    <View style={styles.card}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>

      {/* Notes Section */}
      {exercise.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notes</Text>
          <Text style={styles.sectionText}>{exercise.notes}</Text>
        </View>
      )}

      {/* Working Sets */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Working Sets</Text>
        <Text style={styles.sectionText}>{exercise.working_sets}</Text>
      </View>

      {/* Reps */}
      {exercise.reps && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Reps</Text>
          <Text style={styles.sectionText}>{exercise.reps}</Text>
        </View>
      )}

      {/* Intensity */}
      {exercise.intensity && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Intensity</Text>
          <Text style={styles.sectionText}>{exercise.intensity}</Text>
        </View>
      )}

      {/* Substitution Exercises */}
      {(exercise.substitution_1 || exercise.substitution_2) && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Substitution Exercises</Text>
          {exercise.substitution_1 && <Text style={styles.sectionText}>1. {exercise.substitution_1}</Text>}
          {exercise.substitution_2 && <Text style={styles.sectionText}>2. {exercise.substitution_2}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default WorkoutCardDisplay;
