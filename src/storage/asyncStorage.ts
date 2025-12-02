import { Platform } from 'react-native';

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let storage: AsyncStorageLike;

if (Platform.OS === 'web') {
  storage = {
    async getItem(key: string) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: string) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore quota or private mode errors
      }
    },
    async removeItem(key: string) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
} else {
  // Use require to avoid static resolution on web
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default as AsyncStorageLike;
  storage = AsyncStorage;
}

export default storage;
