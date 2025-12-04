import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { register } from '../api/auth';
import { createAndStoreWallet } from '../services/WalletService';

export default function RegisterScreen({ navigation }) {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const handleRegister = async () => {
    if(!email||!password){Alert.alert('خطا','لطفا تمام فیلدها را پر کنید');return}
    try{
      await register(email,password);
      const {address,mnemonic} = await createAndStoreWallet();
      Alert.alert('موفق','حساب و کیف پول ساخته شد. عبارت بازیابی:\n'+mnemonic, [{text:'متوجه شدم', onPress:() => navigation.navigate('Login')}]);
    }catch(e){Alert.alert('خطا', e.message)}
  }
  return (<View style={{padding:20}}><Text>ثبت‌نام</Text><TextInput placeholder="ایمیل" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /><TextInput placeholder="رمز" value={password} onChangeText={setPassword} secureTextEntry /><TouchableOpacity onPress={handleRegister}><Text>ثبت‌نام</Text></TouchableOpacity></View>);
}
