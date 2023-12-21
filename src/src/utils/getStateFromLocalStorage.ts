import { getItem } from 'utils/storage';

import { decode } from './encoder/encoder';

export default function getStateFromLocalStorage(key: string) {
  const data: any = getItem(key);
  if (data) {
    return JSON.parse(decode(data));
  }
  return null;
}
