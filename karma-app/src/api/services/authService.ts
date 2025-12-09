import apiClient from '../apiClient';

interface LoginResponse {
  token: string;
}

export const authService = {
  async login(username: string, password: string): Promise<string> {
    const response = await apiClient.post<LoginResponse>('/Auth/login', {
      username,
      password,
    });
    return response.data.token;
  },

  async logout(): Promise<void> {
    // Add any logout API calls if needed
    return Promise.resolve();
  }
};

export default authService; // Add this export