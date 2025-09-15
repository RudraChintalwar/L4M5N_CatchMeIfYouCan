// components/TodoList.tsx
import TodoItem from './TodoItem';
import { Todo } from './TodoApp';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
}

export default function TodoList({ todos, onToggleTodo, onDeleteTodo, onEditTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Your list is empty</p>
        <p className="text-sm mt-2">Add a task to get started</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onEdit={onEditTodo}
        />
      ))}
    </ul>
  );
}