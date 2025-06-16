import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Button, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    id: null,
    title: '',
    dueDate: new Date(),
    priority: 'Medium',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const saved = await AsyncStorage.getItem('@assignments');
      if (saved) setAssignments(JSON.parse(saved));
    } catch (err) {
      console.error('Failed to load assignments', err);
    }
  };

  const saveAssignments = async (items) => {
    try {
      await AsyncStorage.setItem('@assignments', JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save assignments', err);
    }
  };

  const handleAdd = () => {
    setCurrentAssignment({
      id: null,
      title: '',
      dueDate: new Date(),
      priority: 'Medium',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!currentAssignment.title) return;

    const updated = currentAssignment.id
      ? assignments.map(a => a.id === currentAssignment.id ? currentAssignment : a)
      : [...assignments, { ...currentAssignment, id: Date.now().toString() }];

    setAssignments(updated);
    saveAssignments(updated);
    setModalVisible(false);
  };

  const handleEdit = (assignment) => {
    setCurrentAssignment({ ...assignment });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    const filtered = assignments.filter(a => a.id !== id);
    setAssignments(filtered);
    saveAssignments(filtered);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>

      <FlatList
        data={assignments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.assignmentCard, { borderLeftColor: getPriorityColor(item.priority) }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Icon name="edit" color="#4CAF50" containerStyle={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icon name="delete" color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.assignmentText}><Icon name="event" size={16} /> Due: {formatDate(item.dueDate)}</Text>
            <Text style={styles.assignmentText}><Icon name="flag" size={16} /> Priority: {item.priority}</Text>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {currentAssignment.id ? 'Edit Assignment' : 'Add Assignment'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Title *"
            value={currentAssignment.title}
            onChangeText={(text) => setCurrentAssignment({ ...currentAssignment, title: text })}
          />

          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text>{formatDate(currentAssignment.dueDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={currentAssignment.dueDate}
              mode="date"
              display="default"
              onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) {
                  setCurrentAssignment({ ...currentAssignment, dueDate: selected });
                }
              }}
            />
          )}

          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={currentAssignment.priority}
            onValueChange={(itemValue) =>
              setCurrentAssignment({ ...currentAssignment, priority: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>

          <View style={styles.modalButtons}>
            <Button title="Cancel" color="#888" onPress={() => setModalVisible(false)} />
            <Button title="Save" color="#2196F3" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Assignments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8fafc',
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
  assignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  assignmentText: {
    color: '#334155',
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
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
    color: '#1e293b',
  },
  input: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    marginVertical: 8,
    fontWeight: '600',
    color: '#475569',
  },
  dateButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
