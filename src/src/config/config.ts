import { version } from '../../package.json';

interface GlobalScope extends Window {
  API_BASE_PATH?: string;
  PREFIX?: string;
  API_AUTH_TOKEN?: string;
}

let globalScope: GlobalScope;

try {
  globalScope = window;
} catch (ex) {
  /* eslint-disable-next-line no-restricted-globals */
  globalScope = self;
}

const isDEVModeOn: boolean = process.env.NODE_ENV === 'development';

function getBaseHost(): string {
  return isDEVModeOn ? 'http://localhost:5000' : '';
}

function getBasePath(isApiBasePath: boolean = true): string {
  if (globalScope.API_BASE_PATH === '{{ base_path }}') {
    return isApiBasePath ? '' : '/';
  }
  return `${globalScope.API_BASE_PATH}`;
}

let API_HOST: string = `${getBaseHost()}${getBasePath()}/api`;

function getAPIHost() {
  return API_HOST;
}

function getPrefix(): string {
  return `${globalScope.PREFIX}`;
}

function getTrackingURI(): string {
  let host = getBaseHost();
  if (host === '') {
    const { protocol, hostname, port } = window.location;
    host = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  return `${host}${getPrefix()}`;
}

function setAPIBasePath(basePath: string) {
  globalScope.API_BASE_PATH = basePath;
  API_HOST = `${getBaseHost()}${getBasePath()}/api`;
}

function setAPIAuthToken(authToken: string) {
  globalScope.API_AUTH_TOKEN = authToken;
}

function getAPIAuthToken() {
  return `${globalScope.API_AUTH_TOKEN}`;
}

export const AIM_VERSION = version;

const PATHS_TO_SHOW_CACHE_BANNERS = ['notebook', 'aim-sage'];

export function checkIsBasePathInCachedEnv(basePath: string) {
  const split_paths = basePath.split('/');
  const parsed_path = split_paths[split_paths.length - 1];

  return PATHS_TO_SHOW_CACHE_BANNERS.includes(parsed_path);
}

export {
  getBaseHost,
  getBasePath,
  getAPIHost,
  getPrefix,
  getTrackingURI,
  setAPIBasePath,
  setAPIAuthToken,
  getAPIAuthToken,
};
