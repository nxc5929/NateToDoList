import type { Todo, Priority } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  sortByPriority?: boolean;
  showCompletionTime?: boolean;
}

export function TodoList({ todos, onToggle, onDelete, sortByPriority = false, showCompletionTime = false }: TodoListProps) {
  const priorityOrder: Record<Priority, number> = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  const sortedTodos = sortByPriority
    ? [...todos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    : todos;

  if (sortedTodos.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8 text-gray-400">
        <p className="text-sm sm:text-base">No todos found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} showCompletionTime={showCompletionTime} />
      ))}
    </div>
  );
}
