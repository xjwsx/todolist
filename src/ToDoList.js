import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState("ALL");

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

  const completedCount = todos.filter((item) => item.completed).length;

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

  const handleToggleAll = useCallback(() => {
    const allCompleted = todos.every((todo) => todo.completed);
    setTodos(todos.map((todo) => ({ ...todo, completed: !allCompleted })));
  }, [todos]);

  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditingId(id);
    setEditingTitle(todoToEdit.title);
    setIsEditing((prev) => !prev);
  };

  const handleSaveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editingTitle } : todo
      )
    );
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteCompleted = () => {
    const updateTodos = todos.filter((todo) => !todo.completed);
    setTodos(updateTodos);
    localStorage.setItem("todos", JSON.stringify(updateTodos));
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
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

  const filteredList = todos.filter((item) => {
    switch (filterType) {
      case "INCOMPLETED":
        return !item.completed;
      case "COMPLETED":
        return item.completed;
      default:
        return true;
    }
  });

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
        <Select value={filterType} onChange={handleFilterChange}>
          <option value="ALL">All</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETED">Incompleted</option>
        </Select>
      </Form>
      <SelectAllWrapper>
        <Checkbox
          type="checkbox"
          checked={todos.length > 0 && todos.every((todo) => todo.completed)}
          onChange={handleToggleAll}
        />
        <span style={{ flexGrow: 1, marginLeft: "0.5rem" }}>Select All</span>
        {completedCount > 0 && (
          <DeleteAllButton onClick={handleDeleteCompleted}>
            {completedCount}개 선택 삭제
          </DeleteAllButton>
        )}
      </SelectAllWrapper>
      <TodoList>
        {filteredList.map((todo) => (
          <TodoItem key={todo.id} completed={todo.completed}>
            <div>
              <Checkbox
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              {editingId === todo.id && isEditing ? (
                <EditInput
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(todo.id)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSaveEdit(todo.id);
                  }}
                  autoFocus
                />
              ) : (
                <TodoText completed={todo.completed}>{todo.title}</TodoText>
              )}
            </div>
            <ButtonGroup>
              <EditButton onClick={() => handleEditTodo(todo.id)}>
                Edit
              </EditButton>
              <DeleteButton onClick={(e) => handleDeleteTodo(todo.id, e)}>
                Delete
              </DeleteButton>
            </ButtonGroup>
          </TodoItem>
        ))}
      </TodoList>
    </Wrapper>
  );
};

export default ToDoList;

const Wrapper = styled.div`
  max-width: 500px;
  width: 100%;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
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

const DeleteAllButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  &:hover {
    background-color: #2563eb;
    cursor: pointer;
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
  flex-shrink: 0;
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

const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const EditButton = styled.button`
  background: transparent;
  color: #4b5563;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: #1f2937;
  }
`;

const EditInput = styled.input`
  margin-left: 0.5rem;
  padding: 2px 5px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;
const Select = styled.select`
  border: 1px solid gray;
  border-radius: 6px;
  background-color: transparent;
  padding: 0 2px;
  font-size: 14px;
  line-height: 20px;
  color: black;
  margin-left: 10px;
`;
