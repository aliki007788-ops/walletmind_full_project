import { Wallet } from 'ethers';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';

const WALLET_MNEMONIC_KEY = 'walletMnemonic';

export const createAndStoreWallet = async () => {
  const randomBytes = await Random.getRandomBytesAsync(16);
  const wallet = Wallet.createRandom({ extraEntropy: randomBytes });
  const mnemonic = wallet.mnemonic.phrase;
  await SecureStore.setItemAsync(WALLET_MNEMONIC_KEY, mnemonic);
  return { address: wallet.address, mnemonic };
};

export const getUserWalletAddress = async () => { const mnemonic = await SecureStore.getItemAsync(WALLET_MNEMONIC_KEY); if(!mnemonic) return null; const wallet = Wallet.fromMnemonic(mnemonic); return wallet.address; };
