import { useEffect, useState } from "react";
import styled from "styled-components";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);

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

  useEffect(() => {
    getToDos();
  }, []);

  return (
    <Wrapper>
      <Header>ToDoList</Header>
      <TodoList>
        {todos.map((todo) => (
          <TodoItem key={todo.id}>
            <div>
              <TodoText>{todo.title}</TodoText>
            </div>
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

const TodoText = styled.span`
  margin-left: 0.5rem;
`;
