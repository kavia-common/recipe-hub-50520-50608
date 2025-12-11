//
// Simple API client for the Recipe app
//
// Reads base URL from REACT_APP_API_BASE,
// attaches Authorization Bearer token from localStorage if present,
// and handles 401 Unauthorized responses globally.
//

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns the API base URL configured via environment variable.
   * Falls back to relative '/api' so local proxy setups can work.
   */
  const base = process.env.REACT_APP_API_BASE || '/api';
  return base.replace(/\/+$/, '');
}

/**
 * Convenience wrappers for auth endpoints. These are optional helpers that use apiRequest.
 * Keeping them here ensures a single place for endpoint paths.
 */

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Perform a fetch request against the backend API with auth handling.
   *
   * Parameters:
   * - path (string): Route path or absolute URL. If it starts with 'http', it will be used as is,
   *                  otherwise it will be joined with REACT_APP_API_BASE.
   * - options (object): fetch options; headers are merged with defaults.
   *
   * Behavior:
   * - Adds Authorization: Bearer <token> header if localStorage.token exists.
   * - Sends/accepts JSON by default.
   * - If response is 401, clears local token and throws an Error with status for upstream handling.
   *
   * Returns:
   * - Parsed JSON body for JSON responses, otherwise raw Response if parsing fails.
   */
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${getApiBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;

  const token = localStorage.getItem('token');
  const defaultHeaders = {
    Accept: 'application/json',
  };

  // Attach JSON Content-Type only if body is provided and not FormData
  let headers = { ...defaultHeaders, ...(options.headers || {}) };
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    credentials: 'include', // in case backend uses cookies in addition to tokens
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, finalOptions);

    if (res.status === 401) {
      // Unauthorized: clear token and bubble up
      try {
        localStorage.removeItem('token');
      } catch (e) {
        // ignore storage errors
      }
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }

    // Try to parse JSON when content-type is application/json
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data?.message || 'Request failed');
        err.status = res.status;
        err.data = data;
        throw err;
      }
      return data;
    }

    if (!res.ok) {
      const err = new Error(`Request failed with status ${res.status}`);
      err.status = res.status;
      throw err;
    }

    // Non-JSON response; return Response object for caller to handle (e.g., blobs)
    return res;
  } catch (error) {
    // Re-throw with minimal wrapping so upstream can handle
    throw error;
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /**
   * Persist auth token for future requests.
   */
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /**
   * Get current auth token from localStorage.
   */
  return localStorage.getItem('token');
}

// PUBLIC_INTERFACE
export async function authLogin(email, password) {
  /**
   * Calls /auth/login with provided credentials.
   */
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// PUBLIC_INTERFACE
export async function authRegister(name, email, password) {
  /**
   * Calls /auth/register with provided data.
   */
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}
