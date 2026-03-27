export type Priority = 'Low' | 'Medium' | 'High';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  completedAt?: string; // ISO 8601 timestamp
}
