import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface WorkoutCardProps {
  exercise: any; // Adjust this type based on your actual data structure
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise }) => {
  const defaultExercise = {
    exercise_name: "Unnamed Exercise",
    notes: "",
    weight: "",
    reps: "",
    rpe: "",
  };

  const currentExercise = exercise || defaultExercise;

  const [sets, setSets] = useState<{ setNumber: number; weight: string; reps: string; rpe: string }[]>([]);
  const [notes, setNotes] = useState<string>(currentExercise.notes || '');

  useEffect(() => {
    setNotes(currentExercise.notes || '');

    // Initialize the correct number of sets based on `working_sets`
    const initialSets = [];
    for (let i = 0; i < currentExercise.working_sets; i++) {
      initialSets.push({
        setNumber: i + 1,
        weight: currentExercise.weight || '',
        reps: currentExercise.reps || '',
        rpe: currentExercise.rpe || '',
      });
    }

    setSets(initialSets);
  }, [currentExercise]);

  const addSet = () => {
    setSets([...sets, { setNumber: sets.length + 1, weight: '', reps: '', rpe: '' }]);
  };

  return (
    <View style={styles.card}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{currentExercise.exercise_name}</Text>

      {/* Notes Section */}
      <View style={styles.notesSection}>
        <Text style={styles.notesHeader}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={styles.notesInput}
          multiline={true}
          placeholderTextColor="#9e9e9e"
        />
      </View>

      {/* Headers for Sets */}
      <View style={styles.setHeaders}>
        <Text style={styles.setHeaderText}>Weight</Text>
        <Text style={styles.setHeaderText}>Reps</Text>
        <Text style={styles.setHeaderText}>RPE</Text>
      </View>

      {/* Input for Sets */}
      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={styles.setText}>Set {set.setNumber}</Text>
          <TextInput
            style={styles.input}
            value={set.weight}
            onChangeText={(text) => {
              const newSets = [...sets];
              newSets[index].weight = text;
              setSets(newSets);
            }}
            placeholderTextColor="#9e9e9e"
          />
          <TextInput
            style={styles.input}
            value={set.reps}
            onChangeText={(text) => {
              const newSets = [...sets];
              newSets[index].reps = text;
              setSets(newSets);
            }}
            placeholderTextColor="#9e9e9e"
          />
          <TextInput
            style={styles.input}
            value={set.rpe}
            onChangeText={(text) => {
              const newSets = [...sets];
              newSets[index].rpe = text;
              setSets(newSets);
            }}
            placeholderTextColor="#9e9e9e"
          />
        </View>
      ))}

      {/* Intensity of the Last Set */}
      {currentExercise.intensity && (
        <View style={styles.intensitySection}>
          <Text style={styles.intensityText}>
            Last Set Intensity Technique: {currentExercise.intensity}
          </Text>
        </View>
      )}

      {/* Add More Sets */}
      <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
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
  notesSection: {
    marginBottom: 20,
  },
  notesHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 4,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  setHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  setHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    width: 80,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  setText: {
    marginRight: 10,
    fontSize: 16,
    color: '#424242',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 80,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  intensitySection: {
    marginTop: 20,
  },
  intensityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A9A9A9',
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  addSetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutCard;
