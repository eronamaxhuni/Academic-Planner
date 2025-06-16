import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadReminders();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable notifications in settings.');
      }
    }
  };

  const loadReminders = async () => {
    const saved = await AsyncStorage.getItem('@reminders');
    if (saved) setReminders(JSON.parse(saved));
  };

  const saveReminders = async (data) => {
    setReminders(data);
    await AsyncStorage.setItem('@reminders', JSON.stringify(data));
  };

  const scheduleReminder = async () => {
    if (!title) return Alert.alert('Reminder title is required');

    const trigger = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

        const id = await Notifications.scheduleNotificationAsync({
    content: {
        title: 'Reminder',
        body: title,
        sound: true, 
    },
    trigger,
    });


    const newReminder = {
      id,
      title,
      time: trigger.toLocaleString(),
    };

    const updated = [...reminders, newReminder];
    saveReminders(updated);
    setModalVisible(false);
    setTitle('');
    setDate(new Date());
    setTime(new Date());
  };

  const clearAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem('@reminders');
    setReminders([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <Ionicons name="notifications-outline" size={24} color="#6366f1" /> Reminders
      </Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No reminders yet.</Text>}
      />

      <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Add Reminder</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.pickerText}>{date.toDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.pickerText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selected) => {
                if (selected) setDate(selected);
                setShowDatePicker(false);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(e, selected) => {
                if (selected) setTime(selected);
                setShowTimePicker(false);
              }}
            />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={scheduleReminder}>
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 15 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Reminders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderLeftWidth: 5,
    borderLeftColor: '#6366f1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  plusButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#10b981',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  clearBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  clearText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modal: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 30,
  },
});
