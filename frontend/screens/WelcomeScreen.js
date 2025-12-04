import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:48}}>W</Text>
      <Text>به WalletMind خوش آمدید</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text>ساخت حساب جدید</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text>ورود</Text></TouchableOpacity>
    </View>
  );
}
