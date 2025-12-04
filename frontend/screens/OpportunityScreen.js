import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRamp } from '@ramp-network/react-native-sdk';
import { getUserWalletAddress } from '../services/WalletService';

export default function OpportunityScreen({ route, navigation }){
  const { savings } = route.params; const [userAddress,setUserAddress]=useState('');
  useEffect(()=>{ const f = async ()=>{ const a = await getUserWalletAddress(); if(a) setUserAddress(a); }; f(); },[]);
  const { show, on } = useRamp({ hostAppName: 'WalletMind', hostLogoUrl: 'https://walletmind.app/logo.png', hostApiKey: 'RAMP_API_KEY_PLACEHOLDER', swapAsset: 'USDT_POLYGON', swapAmount: savings.toFixed(2), userAddress });
  useEffect(()=>{ const unsub = on('PURCHASE_CREATED', (event)=>{ Alert.alert('تراکنش ایجاد شد', JSON.stringify(event.payload)); navigation.navigate('Dashboard'); }); return ()=>unsub(); },[on]);
  return (<View style={{padding:20}}><Text>تبدیل ${savings.toFixed(2)} به USDT</Text><TouchableOpacity onPress={() => { if(!userAddress) { Alert.alert('در حال آماده سازی کیف پول'); return; } show(); }}><Text>{!userAddress ? 'در حال آماده سازی کیف پول...' : 'ادامه و خرید امن تتر'}</Text></TouchableOpacity></View>);
}
