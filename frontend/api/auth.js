import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_URL = 'http://192.168.1.100:3000/auth';
const client = axios.create({ baseURL: API_URL });
export const register = async (email, password) => { const res = await client.post('/register', { email, password }); return res.data; };
export const login = async (email, password) => { const res = await client.post('/login', { email, password }); const token = res.data.access_token; if (token) await SecureStore.setItemAsync('accessToken', token); return token; };
export const logout = async () => { await SecureStore.deleteItemAsync('accessToken'); };
