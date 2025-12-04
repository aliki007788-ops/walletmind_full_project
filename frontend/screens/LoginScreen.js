import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { login } from '../api/auth';

export default function LoginScreen({ navigation }){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const handleLogin = async () => { try { await login(email,password); navigation.replace('Dashboard'); } catch(e){ Alert.alert('خطا', e.message); } }
  return (<View style={{padding:20}}><Text>ورود</Text><TextInput placeholder="ایمیل" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /><TextInput placeholder="رمز" value={password} onChangeText={setPassword} secureTextEntry /><TouchableOpacity onPress={handleLogin}><Text>ورود</Text></TouchableOpacity></View>);
}
