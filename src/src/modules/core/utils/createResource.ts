import { RequestOptions } from 'https';
import create from 'zustand';

import { getPrefix } from 'config/config';

import { ErrorCode } from 'services/NetworkService';

export interface IResourceState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

interface CreateResourceError {
  error_code: string;
  message: string;
}

const defaultState = {
  data: null,
  loading: true,
  error: null,
};

function createResource<T, GetterArgs = RequestOptions | any>(getter: any) {
  const state = create<IResourceState<T>>(() => defaultState);

  async function fetchData(args?: GetterArgs) {
    state.setState({ loading: true });
    try {
      const data = await getter(args);
      state.setState({ data, loading: false });
    } catch (error: CreateResourceError | any) {
      if (error?.error_code === ErrorCode.RESOURCE_DOES_NOT_EXIST) {
        window.location.href = getPrefix();
      }
      state.setState({ error, loading: false });
    }
  }
  function destroy() {
    state.destroy();
    state.setState(defaultState, true);
  }
  return { fetchData, state, destroy };
}

export default createResource;
