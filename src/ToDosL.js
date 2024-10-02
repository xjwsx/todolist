import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ToDosL = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchInitialTodos = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );
        const data = await response.json();
        const initialTodos = data.map((todo) => ({
          ...todo,
          id: todo.id,
        }));
        setTodos(initialTodos);
        localStorage.setItem("todos", JSON.stringify(initialTodos));
      } catch (error) {
        console.error("Error fetching initial todos:", error);
      }
    };

    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      fetchInitialTodos();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <Container>
      <Title>To-Do List</Title>
      <Form onSubmit={addTodo}>
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <Button type="submit">+</Button>
      </Form>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <div>
              <IconButton onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? "☑" : "☐"}
              </IconButton>
              <TodoText completed={todo.completed}>{todo.title}</TodoText>
            </div>
            <IconButton delete onClick={() => deleteTodo(todo.id)}>
              &#x1F5D1;
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ToDosL;

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  margin-bottom: 1rem;
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

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  &:hover {
    background-color: #2563eb;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
`;

const TodoText = styled.span`
  margin-left: 0.5rem;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#9ca3af" : "inherit")};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${(props) => (props.delete ? "#ef4444" : "inherit")};
  &:hover {
    color: ${(props) => (props.delete ? "#dc2626" : "#3b82f6")};
  }
`;
