import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
  TextInput, Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons'; // ose import nga react-native-vector-icons

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CourseSchedule = () => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    name: '',
    day: 'Monday',
    startTime: new Date(),
    endTime: new Date()
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('@scheduleCourses');
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error('Failed to load courses', e);
    }
  };

  const saveCourses = async (coursesToSave) => {
    try {
      await AsyncStorage.setItem('@scheduleCourses', JSON.stringify(coursesToSave));
    } catch (e) {
      console.error('Failed to save courses', e);
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse({
      id: null,
      name: '',
      day: 'Monday',
      startTime: new Date(),
      endTime: new Date()
    });
    setModalVisible(true);
  };

  const handleSaveCourse = () => {
    if (!currentCourse.name) return;

    const newCourse = {
      ...currentCourse,
      id: currentCourse.id || Date.now().toString()
    };
    const updatedCourses = currentCourse.id
      ? courses.map(c => c.id === currentCourse.id ? newCourse : c)
      : [...courses, newCourse];

    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveCourses(updated);
  };

  const handleEdit = (course) => {
    setCurrentCourse({ ...course });
    setModalVisible(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <FlatList
        data={courses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <View style={styles.cardStripe} />
            <View style={styles.cardContent}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseName}>{item.name}</Text>
                <View style={styles.iconRow}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Icon name="edit" color="#4CAF50" size={24} containerStyle={styles.iconMargin} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Icon name="delete" color="#F44336" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="event" size={18} color="#334155" style={styles.infoIcon} />
                <Text style={styles.courseText}>{item.day}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="schedule" size={18} color="#334155" style={styles.infoIcon} />
                <Text style={styles.courseText}>
                  {formatTime(new Date(item.startTime))} - {formatTime(new Date(item.endTime))}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {currentCourse.id ? 'Edit Course' : 'Add Course'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Course Name *"
            value={currentCourse.name}
            onChangeText={(text) => setCurrentCourse({ ...currentCourse, name: text })}
          />

          <Text style={styles.label}>Select Day</Text>
          <Picker
            selectedValue={currentCourse.day}
            onValueChange={(itemValue) => setCurrentCourse({ ...currentCourse, day: itemValue })}
            style={styles.picker}
          >
            {daysOfWeek.map((day) => (
              <Picker.Item label={day} value={day} key={day} />
            ))}
          </Picker>

          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeButton}>
            <Text>{formatTime(currentCourse.startTime)}</Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={currentCourse.startTime}
              mode="time"
              display="default"
              onChange={(event, selected) => {
                setShowStartPicker(false);
                if (selected) {
                  setCurrentCourse({ ...currentCourse, startTime: selected });
                }
              }}
            />
          )}

          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeButton}>
            <Text>{formatTime(currentCourse.endTime)}</Text>
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={currentCourse.endTime}
              mode="time"
              display="default"
              onChange={(event, selected) => {
                setShowEndPicker(false);
                if (selected) {
                  setCurrentCourse({ ...currentCourse, endTime: selected });
                }
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
            <Button title="Save" onPress={handleSaveCourse} color="#2196F3" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8fafc'
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6366f1',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  cardStripe: {
    width: 6,
    backgroundColor: '#6366f1',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  courseText: {
    color: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  iconRow: {
    flexDirection: 'row',
  },
  iconMargin: {
    marginRight: 10
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b'
  },
  input: {
    height: 40,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  label: {
    marginVertical: 8,
    fontWeight: '600',
    color: '#475569'
  },
  picker: {
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default CourseSchedule;
