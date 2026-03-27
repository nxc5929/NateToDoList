import type { Todo, Priority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  showCompletionTime?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, showCompletionTime = false }: TodoItemProps) {
  const priorityColors: Record<Priority, string> = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  };

  const formatCompletionTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 sm:w-5 h-4 sm:h-5 accent-blue-600 cursor-pointer shrink-0 mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm sm:text-base ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
          } wrap-break-word`}
        >
          {todo.text}
        </span>
        {showCompletionTime && todo.completedAt && (
          <span className="block text-xs text-gray-500 mt-1">
            Completed: {formatCompletionTime(todo.completedAt)}
          </span>
        )}
      </div>
      <span className={`px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-medium rounded-full whitespace-nowrap shrink-0 ${priorityColors[todo.priority]}`}>
        {todo.priority}
      </span>
      {onDelete && !todo.completed && (
        <button
          onClick={() => onDelete(todo.id)}
          className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded shrink-0 transition-colors"
          title="Delete todo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
