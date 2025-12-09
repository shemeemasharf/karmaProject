import apiClient from '../apiClient';
import { Item } from '../../types/types';

const getToken = () => localStorage.getItem('token') || '';

export const itemService = {
  async getItems(): Promise<Item[]> {
    const response = await apiClient.get<Item[]>('/Items', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await apiClient.post<Item>('/Items', item, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  async updateItem(id: number, item: Partial<Item>): Promise<Item> {
    const response = await apiClient.put<Item>(`/Items/${id}`, item, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
  },

  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`/Items/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  }
};

export default itemService; // Add this export