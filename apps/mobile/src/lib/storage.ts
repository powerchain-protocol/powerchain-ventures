import * as SecureStore from "expo-secure-store";
export const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
export async function getJson<T>(key:string):Promise<T|null>{const raw=await secureStorage.getItem(key);if(!raw)return null;try{return JSON.parse(raw) as T}catch{return null}}
export async function setJson(key:string,value:unknown){await secureStorage.setItem(key,JSON.stringify(value))}
