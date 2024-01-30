import AsyncStorage from '@react-native-async-storage/async-storage';

export function useWebToken() {
  const storeTokenFromWeb = async (value: object, key: string) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('error while saving token');
    }
  };

  const getTokenFromStorage = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      console.warn('error while sending token');
    }
  };

  const clearTokenFromStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.warn('error while clearing storage');
    }
  };

  return {storeTokenFromWeb, getTokenFromStorage, clearTokenFromStorage};
}
