import { getPrefix } from 'config/config';

import { IAppData } from 'types/services/models/metrics/metricsAppModel';
import { IApiRequest } from 'types/services/services';

import API from '../api';

const endpoints = {
  NAMESPACES: '/chooser/namespaces',
  CURRENT_NAMESPACE: `${getPrefix()}chooser/namespaces/current`,
};

function fetchNamespacesList(): IApiRequest<IAppData[]> {
  return API.getFromBaseHost(endpoints.NAMESPACES);
}

function fetchCurrentNamespace(): IApiRequest<IAppData[]> {
  return API.getFromBaseHost(endpoints.CURRENT_NAMESPACE);
}

async function fetchCurrentNamespacePath(): Promise<string> {
  const data = await fetchCurrentNamespace().call();
  const selected = data.code;
  return selected === 'default' ? '' : `/ns/${data.code}`;
}

const namespacesService = {
  endpoints,
  fetchNamespacesList,
  fetchCurrentNamespace,
  fetchCurrentNamespacePath,
};

export default namespacesService;
