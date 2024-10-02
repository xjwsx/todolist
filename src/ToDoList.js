import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const getToDos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      if (response.status === 200) {
        const data = await response.json();
        setTodos(data);
      } else {
        alert("Failed to load data. Please refresh the page.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load data. Please refresh the page.");
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      title: newTodoTitle,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
  };

  const handleToggleComplete = useCallback(
    (id) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [todos]
  );

  const handleDeleteTodo = (id, e) => {
    e.stopPropagation();
    const updateTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updateTodos);
    localStorage.setItem("todos", JSON.stringify(updateTodos));
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos) {
      setTodos(storedTodos);
    } else {
      getToDos();
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  return (
    <Wrapper>
      <Header>ToDoList</Header>
      <Form onSubmit={handleAddTodo}>
        <Input
          type="text"
          placeholder="Add New To-Do"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <AddButton type="submit">Add</AddButton>
      </Form>
      <TodoList>
        {todos.map((todo) => (
          <TodoItem key={todo.id} completed={todo.completed}>
            <div>
              <Checkbox
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              <TodoText completed={todo.completed}>{todo.title}</TodoText>
            </div>
            <DeleteButton onClick={(e) => handleDeleteTodo(todo.id, e)}>
              Delete
            </DeleteButton>
          </TodoItem>
        ))}
      </TodoList>
    </Wrapper>
  );
};

export default ToDoList;

const Wrapper = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px 0 0 4px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const AddButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  &:hover {
    background-color: #2563eb;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TodoItem = styled.li`
  padding: 0.5rem 0;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
`;

const DeleteButton = styled.button`
  background: transparent;
  color: red;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: #ff8293;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const TodoText = styled.span`
  margin-left: 0.5rem;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#9ca3af" : "inherit")};
`;
