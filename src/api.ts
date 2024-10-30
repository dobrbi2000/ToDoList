import { RequestParams } from './types';

export async function request({
  method = 'POST',
  suffix,
  body,
  credentials = 'include',
}: RequestParams): Promise<boolean> {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const url = `https://ya-praktikum.tech/api/v2/${suffix}`;
  console.log('URL API:', url);

  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
      credentials: credentials,
    });
    console.log('Response from Request:', response);
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    if (contentType && contentType.includes('application/json')) {
      await response.json();
    } else {
      await response.text();
    }
    return true;
  } catch (error) {
    console.error('Request failed:', error);
    return false;
  }
}
