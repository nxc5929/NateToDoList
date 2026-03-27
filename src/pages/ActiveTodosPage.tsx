import { Link } from 'react-router-dom';
import type { Todo, Priority } from '../types';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';

interface ActiveTodosPageProps {
  todos: Todo[];
  onAdd: (text: string, priority: Priority) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ActiveTodosPage({ todos, onAdd, onToggle, onDelete }: ActiveTodosPageProps) {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Active Todos</h1>
          <Link
            to="/completed"
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 font-medium text-sm sm:text-base"
          >
            Completed
            {completedCount > 0 && (
              <span className="inline-block bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                {completedCount}
              </span>
            )}
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-lg shadow text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            <span className="text-xl sm:text-2xl font-bold text-blue-600">{activeTodos.length}</span> active{' '}
            {activeTodos.length === 1 ? 'todo' : 'todos'}
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Create New Todo</h2>
          <TodoInput onAdd={onAdd} />
        </div>

        {/* Todos List */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {activeTodos.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-400 text-base sm:text-lg">No active todos. Great job! 🎉</p>
            </div>
          ) : (
            <TodoList todos={activeTodos} onToggle={onToggle} onDelete={onDelete} sortByPriority={true} />
          )}
        </div>
      </div>
    </div>
  );
}
