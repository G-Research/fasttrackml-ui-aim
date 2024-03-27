import { getAPIHost, getBaseHost } from 'config/config';

function createAPIRequestWrapper<ResponseDataType>(
  url: string,
  options: RequestInit = {},
  stream?: boolean,
) {
  const controller = new AbortController();
  const signal = controller.signal;

  return {
    call: (exceptionHandler?: (error: ResponseDataType) => any) =>
      new Promise((resolve: (data: ResponseDataType) => void, reject) => {
        fetch(`${url}`, { ...options, signal })
          .then(async (response) => {
            try {
              if (response.status >= 400) {
                const body = await response.json();

                if (typeof exceptionHandler === 'function') {
                  exceptionHandler(body);
                }

                // return reject(body.detail); @TODO delete comment, after handling
                return;
              }
              const data = stream ? response.body : await response.json();

              resolve(data);
            } catch (err: Error | any) {
              if (typeof exceptionHandler === 'function') {
                exceptionHandler(err);
              }
              reject(err);
            }
          })
          .catch((err: Error | any) => {
            if (err.name === 'AbortError') {
              // Fetch aborted
            } else {
              if (typeof exceptionHandler === 'function') {
                exceptionHandler(err);
              }
              reject(err);
            }
          });
      }),
    abort: () => controller.abort(),
  };
}

function getStream<ResponseDataType>(
  url: string,
  params?: {},
  options?: RequestInit,
) {
  const queryString = Object.entries(params || {})
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${v}`).join('&');
      } else {
        return `${key}=${value}`;
      }
    })
    .join('&');

  return createAPIRequestWrapper<ResponseDataType>(
    `${getAPIHost()}/${url}${
      options?.method === 'POST' ? '' : queryString ? '?' + queryString : ''
    }`,
    {
      method: 'GET',
      ...options,
      headers: getRequestHeaders(),
      ...(options?.method === 'POST' && {
        body: JSON.stringify(params),
      }),
    },
    true,
  );
}

function getStream1<ResponseDataType>(
  url: string,
  params?: {},
  options?: RequestInit,
) {
  return createAPIRequestWrapper<ResponseDataType>(
    `${getAPIHost()}/${url}${
      options?.method === 'POST' && params
        ? '?' + new URLSearchParams(params).toString()
        : ''
    }`,
    {
      method: 'GET',
      ...options,
      headers: getRequestHeaders(),
      ...(options?.method === 'POST' && {
        body: JSON.stringify(options.body),
      }),
    },
    true,
  );
}

function getFromBaseHost<ResponseDataType>(
  url: string,
  params?: {},
  options?: RequestInit,
) {
  return createAPIRequestWrapper<ResponseDataType>(
    `${getBaseHost()}${url}${
      params ? '?' + new URLSearchParams(params).toString() : ''
    }`,
    {
      method: 'GET',
      ...options,
      headers: getRequestHeaders(),
    },
  );
}

function get<ResponseDataType>(
  url: string,
  params?: {},
  options?: RequestInit,
) {
  return createAPIRequestWrapper<ResponseDataType>(
    `${getAPIHost()}/${url}${
      params ? '?' + new URLSearchParams(params).toString() : ''
    }`,
    {
      method: 'GET',
      ...options,
      headers: getRequestHeaders(),
    },
  );
}

function post<ResponseDataType>(
  url: string,
  data: object,
  options?: RequestInit,
) {
  return createAPIRequestWrapper<ResponseDataType>(`${getAPIHost()}/${url}`, {
    method: 'POST',
    ...options,
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });
}

function put<ResponseDataType>(
  url: string,
  data: object,
  options?: RequestInit,
) {
  return createAPIRequestWrapper<ResponseDataType>(`${getAPIHost()}/${url}`, {
    method: 'PUT',
    ...options,
    headers: getRequestHeaders(),
    body: JSON.stringify(data),
  });
}

function remove<ResponseDataType>(url: string, options?: RequestInit) {
  return createAPIRequestWrapper<ResponseDataType>(`${getAPIHost()}/${url}`, {
    method: 'DELETE',
    ...options,
  });
}

function getTimezoneOffset(): string {
  return `${new Date().getTimezoneOffset()}`;
}

function getRequestHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Timezone-Offset': getTimezoneOffset(),
  };
}

const API = {
  get,
  getFromBaseHost,
  getStream,
  getStream1,
  post,
  put,
  delete: remove,
};

export default API;
