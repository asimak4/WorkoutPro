import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

interface FilePickerProps {
  onFileSelected: (fileData: any) => void; // Define the type for the onFileSelected prop
}

const FilePickerComponent: React.FC<FilePickerProps> = ({ onFileSelected }) => {
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      const fileData = result.uri; // Process file data as needed
      onFileSelected(fileData); // Pass the selected file data to the parent component
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('File selection was canceled');
      } else {
        console.error('FilePicker Error:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a File" onPress={pickFile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

export default FilePickerComponent;
