import './App.css';
import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react';

// Hàm reducer để xử lý các hành động
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload);
    case 'SET':
      return action.payload;
    default:
      return state;
  }
};

const App = () => {
  // State quản lý danh sách công việc và giá trị của ô input
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef();

  // Lưu danh sách công việc vào localStorage khi danh sách thay đổi
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      dispatch({ type: 'SET', payload: storedTodos });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Sử dụng useMemo để lọc các công việc đã hoàn thành và chưa hoàn thành
  const filteredTodos = useMemo(() => {
    return {
      incomplete: todos.filter(todo => !todo.completed),
      completed: todos.filter(todo => todo.completed),
    };
  }, [todos]);

  const handleAddTodo = () => {
    if (!inputValue) return;
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    dispatch({ type: 'ADD', payload: newTodo });
    setInputValue('');
    inputRef.current.focus();
  };

  const handleToggleTodo = (id) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  const handleDeleteTodo = (id) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div>
        <input
          maxLength={50}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      <h2>Incomplete Tasks</h2>
      <ul>
        {filteredTodos.incomplete.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Completed Tasks</h2>
      <ul>
        {filteredTodos.completed.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;