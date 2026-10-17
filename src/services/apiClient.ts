/**
 * @file apiClient.ts
 * @description Centralized HTTP client for communicating with the Gardenvaly Express REST API.
 * Features safe JSON parsing, authorization token attachment, and hardened error normalization.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: Record<string, unknown>;
}

const AUTH_TOKEN_KEY = 'gardenvaly_auth_token';

class ApiClient {
  private baseUrl = '/api';

  public getToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public setToken(token: string): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // ignore
    }
  }

  public removeToken(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const json = await res.json();
        return json;
      } catch {
        return {
          success: false,
          error: `Failed to parse response (Status ${res.status})`,
        };
      }
    }

    if (res.status === 429) {
      return {
        success: false,
        error: 'Too many requests. Please wait a moment before trying again.',
      };
    }

    const text = await res.text();
    return {
      success: res.ok,
      error: res.ok ? undefined : (text || `HTTP error ${res.status}`),
    };
  }

  public async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error communicating with API',
      };
    }
  }

  public async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error communicating with API',
      };
    }
  }

  public async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error communicating with API',
      };
    }
  }

  public async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error communicating with API',
      };
    }
  }

  public async delete<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await this.parseResponse<T>(res);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error communicating with API',
      };
    }
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (res.ok) {
        const json = await res.json();
        return json.success === true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
