// FilePickerComponent.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const FilePickerComponent = ({ handleFilePicker, fileName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>To get started, choose a file to import:</Text>
      <Button title="Select File" onPress={handleFilePicker} />
      {fileName ? (
        <Text style={styles.fileNameText}>Selected File: {fileName}</Text>
      ) : null}
    </View>
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
