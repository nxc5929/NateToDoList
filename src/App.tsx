import { Routes, Route, Navigate } from 'react-router-dom';
import { ActiveTodosPage } from './pages/ActiveTodosPage';
import { CompletedTodosPage } from './pages/CompletedTodosPage';
import { useTodos } from './hooks/useTodos';

export default function App() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/active-todos" element={<ActiveTodosPage todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} />} />
      <Route path="/completed" element={<CompletedTodosPage todos={todos} onToggle={toggleTodo} />} />
      <Route path="/" element={<Navigate to="/active-todos" replace />} />
    </Routes>
  );
}
