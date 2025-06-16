import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;

      if (user?.email === email && user?.password === password) {
        setErrorMsg('');
        await AsyncStorage.setItem('user', JSON.stringify(user));

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          })
        );
      } else {
        setErrorMsg('Email or password is incorrect.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Server error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Ionicons name="lock-closed-outline" size={40} color="#4F46E5" style={styles.icon} />
        <Text style={styles.title}>Login</Text>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.register}>
          Don't have an account?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            Register
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: { alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20, color: '#111827' },
  error: { color: 'red', textAlign: 'center', marginBottom: 10, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6,
    padding: 12, marginBottom: 15, backgroundColor: '#F9FAFB',
  },
  loginButton: {
    backgroundColor: '#22C55E', paddingVertical: 14,
    borderRadius: 8, alignItems: 'center', marginBottom: 10,
  },
  loginText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  register: { textAlign: 'center', color: '#4B5563', marginTop: 10 },
  registerLink: { color: '#3B82F6', fontWeight: '600' },
});
