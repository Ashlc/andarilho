import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const a = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 10000,
});

interface IRequestArguments {
  path: string;
  data?: Record<string, unknown> | FormData; // Generic object for data
  token?: string;
  headers?: Record<string, string>; // Dictionary of headers
  params?: unknown; // Dictionary of query string parameters
  raw?: boolean; // If the response should be raw
  responseType?: 'json' | 'blob'; // Response type
  formData?: boolean; // If the data is a FormData object
}

export const handleHeaders = (
  args: IRequestArguments,
): Record<string, string> => {
  if (args.formData && args.token) {
    return {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${args.token}`,
    };
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (args.token) {
    defaultHeaders.Authorization = `Bearer ${args.token}`;
  }
  return { ...defaultHeaders, ...args.headers };
};

const get = async (args: IRequestArguments): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${args.path}`,
    headers: handleHeaders(args),
    data: JSON.stringify(args.data),
    params: args.params,
    responseType: args.responseType || 'json',
  };

  const response = await a.request(config);

  if (args.raw) {
    return response;
  }

  const { data } = response;
  return data;
};

const post = async (args: IRequestArguments): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `${args.path}`,
    headers: handleHeaders(args),
    params: args.params,
    data: args.formData ? args.data : JSON.stringify(args.data),
  };
  return a.request(config);
};

const put = (args: IRequestArguments): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `${args.path}`,
    headers: handleHeaders(args),
    params: args.params,
    data: args.formData ? args.data : JSON.stringify(args.data),
  };

  return a.request(config);
};

const del = (args: IRequestArguments): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `${args.path}`,
    headers: handleHeaders(args),
    params: args.params,
    data: JSON.stringify(args.data),
  };
  return a.request(config);
};

export { del, get, post, put };
