import React, { useState } from 'react';
import { Button, View, Alert, Text, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import { processWorkoutPlan, WorkoutBlock } from '../HomeScreen/processWorkout';

interface FilePickerProps {
  onFileSelected: (fileData: any) => void;
}

const FilePickerComponent: React.FC<FilePickerProps> = ({ onFileSelected }) => {
  const [fileName, setFileName] = useState<string>('');
  const [fileData, setFileData] = useState<WorkoutBlock[] | null>(null);
  const [viewCalendar, setViewCalendar] = useState<boolean>(true); // Toggle between calendar and table
  const [loading, setLoading] = useState<boolean>(false);  // Loading state
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      if (result) {
        setLoading(true);  // Start loading only after the user has selected a file
        setFileName(result.name!);

        if (result.name?.endsWith('.json')) {
          const fileJson = await fetch(result.uri).then((res) => res.json());
          setFileData(fileJson);
        } else if (result.name!.endsWith('.xlsx')) {
          const data = await fetch(result.uri).then((res) => res.arrayBuffer());
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const processedData = processWorkoutPlan(rawData);
          setFileData(processedData);
        } else {
          Alert.alert('Invalid file format', 'Please select a JSON or Excel file');
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'File selection was cancelled');
      } else {
        console.error('File Picker Error: ', err);
        Alert.alert('Error', `An error occurred: ${err}`);
      }
    } finally {
      setLoading(false);  // End loading
    }
  };

  return (
    <>
        <View style={styles.container}>
        <Text style={styles.instructionText}>To get started, choose a file to import:</Text>
        <Button title="Select File" onPress={pickFile} />
        {fileName ? (
          <Text style={styles.fileNameText}>Selected File: {fileName}</Text>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  fileNameText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
});

export default FilePickerComponent;
