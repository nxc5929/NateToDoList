import { Link } from 'react-router-dom';
import type { Todo } from '../types';
import { TodoList } from '../components/TodoList';

interface CompletedTodosPageProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

export function CompletedTodosPage({ todos, onToggle }: CompletedTodosPageProps) {
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 px-4 py-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Completed Todos</h1>
          <Link
            to="/active-todos"
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 font-medium text-sm sm:text-base"
          >
            Active
            {activeCount > 0 && (
              <span className="inline-block bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                {activeCount}
              </span>
            )}
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            <span className="text-xl sm:text-2xl font-bold text-green-600">{completedTodos.length}</span> completed{' '}
            {completedTodos.length === 1 ? 'todo' : 'todos'}
          </p>
        </div>

        {/* Todos List */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {completedTodos.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-400 text-base sm:text-lg">No completed todos yet. Start completing tasks! 💪</p>
            </div>
          ) : (
            <TodoList todos={completedTodos} onToggle={onToggle} showCompletionTime={true} />
          )}
        </div>
      </div>
    </div>
  );
}
