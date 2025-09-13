import { ParsedCurl } from '../utils/curlParser';

export interface CurlResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export async function executeCurl(parsedCurl: ParsedCurl): Promise<CurlResponse> {
  const { url, method, headers, data } = parsedCurl;

  const requestInit: RequestInit = {
    method: method,
    headers: {
      ...headers,
    },
  };

  // Add Content-Type header only if we have actual data
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestInit.body = data;
    if (!headers['Content-Type'] && !headers['content-type']) {
      requestInit.headers = {
        'Content-Type': 'application/json',
        ...requestInit.headers,
      };
    }
  }

  try {
    const response = await fetch(url, requestInit);
    
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { 
          _raw: text,
          _note: 'Response was not valid JSON, displaying as text'
        };
      }
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    };
  } catch (error) {
    throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}