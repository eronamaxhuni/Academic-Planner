import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      return Alert.alert('Gabim', 'Të gjitha fushat janë të detyrueshme');
    }

    try {
      await AsyncStorage.setItem('user', JSON.stringify({ fullName, email, password }));
      Alert.alert('Sukses', 'Llogaria u krijua me sukses');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Gabim', 'Regjistrimi dështoi');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Ionicons name="person-add-outline" size={40} color="#2196F3" style={styles.icon} />
        <Text style={styles.title}>Krijo Llogari</Text>

        <TextInput
          placeholder="Emër i plotë"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Fjalëkalim"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Regjistrohu</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Ke një llogari?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Hyr
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0D47A1'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    color: '#000'
  },
  registerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  registerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555'
  },
  loginLink: {
    color: '#1E88E5',
    fontWeight: '600'
  }
});
