// API service functions for todo operations
import type { Todo, Priority } from '../types';

const API_BASE_URL = 'https://6ilu0294k1.execute-api.us-east-2.amazonaws.com'; // Replace with your backend URL

export const todoApi = {
  // Fetch all todos
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  // Create a new todo
  async createTodo(text: string, priority: Priority): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        priority,
        completed: false,
      }),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  // Update a todo (toggle completion)
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    return response.json();
  },

  // Delete a todo (if you add delete functionality later)
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};