import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import PlaidLink from '../components/PlaidLink';
import { syncTransactions, getAnalysis } from '../api/plaid';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen(){
  const navigation = useNavigation();
  const [hasPlaid,setHasPlaid]=useState(false); const [analysis,setAnalysis]=useState(null);
  const handleSync = async () => { try { const r = await syncTransactions(); Alert.alert('همگام‌سازی', `${r.count} تراکنش همگام شد`); const a = await getAnalysis(); setAnalysis(a); } catch(e){ Alert.alert('خطا', e.message); } }
  return (<View style={{padding:20}}>
    {!hasPlaid ? <PlaidLink onSuccess={() => setHasPlaid(true)} /> : <TouchableOpacity onPress={handleSync}><Text>همگام‌سازی تراکنش‌ها</Text></TouchableOpacity>}
    {analysis && analysis.map(s => (<View key={s.name}><Text>{s.name} - ${s.yearlyCost}</Text></View>))}
    {analysis && analysis.length>0 && <TouchableOpacity onPress={() => navigation.navigate('Opportunity', { savings: analysis.reduce((sum,s)=>sum+s.yearlyCost,0) })}><Text>نمایش فرصت</Text></TouchableOpacity>}
  </View>);
}
