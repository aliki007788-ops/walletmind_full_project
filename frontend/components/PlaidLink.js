import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { usePlaidLink } from 'react-native-plaid-link-sdk';
import { createLinkToken, exchangePublicToken } from '../api/plaid';

export default function PlaidLink({ onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const generateToken = useCallback(async () => { setLoading(true); try { const token = await createLinkToken(); setLinkToken(token); } catch (e) {} finally { setLoading(false); } }, []);
  useEffect(() => { generateToken(); }, [generateToken]);
  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess: async ({ publicToken }) => { await exchangePublicToken(publicToken); onSuccess(); }, onExit: () => {} });
  if (loading) return <ActivityIndicator />;
  return <TouchableOpacity onPress={() => open()} disabled={!ready}><Text>اتصال امن به حساب بانکی</Text></TouchableOpacity>;
}
