import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, FlatList,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Icon } from 'react-native-elements';

const GradeCalculator = () => {
  const [lectureWeight, setLectureWeight] = useState('60');
  const [exerciseWeight, setExerciseWeight] = useState('40');
  const [lectureScore, setLectureScore] = useState('');
  const [exerciseScore, setExerciseScore] = useState('');
  const [grades, setGrades] = useState([]);

  const calculateGrade = () => {
    const lw = parseFloat(lectureWeight);
    const ew = parseFloat(exerciseWeight);
    const ls = parseFloat(lectureScore);
    const es = parseFloat(exerciseScore);

    if (isNaN(lw) || isNaN(ew) || isNaN(ls) || isNaN(es)) {
      Alert.alert('Invalid Input', 'Please fill in all fields with numbers.');
      return;
    }

    if (lw + ew !== 100) {
      Alert.alert('Invalid Weights', 'The total weight must be exactly 100%.');
      return;
    }

    const finalPercent = (ls * lw + es * ew) / 100;
    let grade = 5;
    let description = 'Fail';

    if (finalPercent >= 90) {
      grade = 10; description = 'Excellent';
    } else if (finalPercent >= 80) {
      grade = 9; description = 'Very Good';
    } else if (finalPercent >= 70) {
      grade = 8; description = 'Good';
    } else if (finalPercent >= 60) {
      grade = 7; description = 'Satisfactory';
    } else if (finalPercent >= 50) {
      grade = 6; description = 'Sufficient';
    }

    const newEntry = {
      id: Date.now().toString(),
      finalPercent: finalPercent.toFixed(2),
      grade,
      description
    };

    setGrades([...grades, newEntry]);
    setLectureScore('');
    setExerciseScore('');
  };

  const deleteEntry = (id) => {
    setGrades(grades.filter(item => item.id !== id));
  };

  const average = grades.length
    ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Grade Calculator</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Lecture Weight (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={lectureWeight} onChangeText={setLectureWeight} />

        <Text style={styles.label}>Exercise Weight (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={exerciseWeight} onChangeText={setExerciseWeight} />

        <Text style={styles.label}>Lecture Score (0–100)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={lectureScore} onChangeText={setLectureScore} />

        <Text style={styles.label}>Exercise Score (0–100)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={exerciseScore} onChangeText={setExerciseScore} />

        <Button title="Add Grade" onPress={calculateGrade} />
      </View>

      <FlatList
        data={grades}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.gradeCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Grade: {item.grade} ({item.description})</Text>
              <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                <Icon name="delete" color="#e53935" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>Final %: {item.finalPercent}%</Text>
          </View>
        )}
      />

      {average && (
        <View style={styles.averageBox}>
          <Text style={styles.averageText}>Average Grade: {average}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default GradeCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8fafc'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#334155'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 10
  },
  list: {
    marginTop: 10
  },
  gradeCard: {
    backgroundColor: '#e0f7fa',
    borderLeftColor: '#0288d1',
    borderLeftWidth: 6,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#006064'
  },
  cardText: {
    marginTop: 4,
    color: '#004d40'
  },
  averageBox: {
    backgroundColor: '#ffe082',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center'
  },
  averageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#795548'
  }
});
