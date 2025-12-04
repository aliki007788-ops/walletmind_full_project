import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_BASE = 'http://192.168.1.100:3000';
const client = axios.create({ baseURL: API_BASE });
client.interceptors.request.use(async (config) => { const token = await SecureStore.getItemAsync('accessToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const createLinkToken = async () => (await client.post('/plaid/create_link_token')).data.link_token;
export const exchangePublicToken = async (publicToken) => (await client.post('/plaid/exchange_public_token', { public_token: publicToken }));
export const syncTransactions = async () => (await client.post('/plaid/sync_transactions')).data;
export const getAnalysis = async () => (await client.get('/analysis/subscriptions')).data;
