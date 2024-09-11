import { getPrefix } from 'config/config';

export function setItem(key: string, value: any) {
  try {
    let namespacedKey = getNamespacedKey(key);
    localStorage.setItem(namespacedKey, value);
  } catch (error) {}
}

export function getItem(key: string) {
  try {
    return localStorage.getItem(getNamespacedKey(key));
  } catch (error) {
    return null;
  }
}

export function removeItem(key: string) {
  try {
    localStorage.removeItem(getNamespacedKey(key));
  } catch (error) {}
}

export function clear() {
  try {
    localStorage.clear();
  } catch (error) {}
}

function getNamespacedKey(key: string) {
  let prefix = getPrefix();
  if (prefix === '/') {
    return key;
  }
  return prefix.replace(new RegExp('/ns/([^/]+)/'), '$1') + ':' + key;
}
