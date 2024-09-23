import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';

const ParsedData = ({ route }: any) => {
  const { data } = route.params; // Receive the parsed data from HomeScreen

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Parsed Data</Text>
      <ScrollView horizontal> {/* Allows horizontal scrolling if there are many columns */}
        <DataTable>
          <DataTable.Header>
            {data && Object.keys(data[0]).map((key, index) => (
              <DataTable.Title key={index}>{key}</DataTable.Title>
            ))}
          </DataTable.Header>

          {data && data.map((row: any, rowIndex: number) => (
            <DataTable.Row key={rowIndex}>
              {Object.keys(row).map((key, colIndex) => (
                <DataTable.Cell key={colIndex}>{row[key]}</DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ParsedData;
