import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"

const App = function () {
  const [newTodoInput, setNewTodoInput] = useState("")
  const [editTodoInput, setEditTodoInput] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTodoId, setSelectedTodoId] = useState("")
  const [todos, setTodos] = useState("");

  const editInput = useRef(null)
  const fun = () =>{
    fetch("/.netlify/functions/retrieveTodo")
    .then((result) => result.json())
    .then((res) => setTodos(res))
  };
    
  useEffect(() => {
    fun();
  }, [handleNewInputChange, handleDelete, handleUpdate])


  const selectedTodo =
  (selectedTodoId && todos.find((todo) => todo.ref["@ref"].id === selectedTodoId)) ||
  null;

  const handleNewInputChange = e => {
    setNewTodoInput(e.target.value)
  }

  const handleEditInputChange = e => {
    setEditTodoInput(e.target.value)
  }

  const handleCreateNewTodo = async (e) => {
    e.preventDefault()
  if (!newTodoInput.length) return
	const result = await fetch('/.netlify/functions/createTodo', {
    method: 'POST',
		body: JSON.stringify({
      message: newTodoInput,
    })
  })
  fun();
  console.log(result)
  }

  const handleEdit = () => {
    if (!selectedTodo) return

    setEditTodoInput(selectedTodo.data.message)
    setIsEditMode(true)
  }

  useEffect(() => {
    if (isEditMode) {
      editInput.current.focus()
    }
  }, [isEditMode])

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editTodoInput.length) {
      handleCancelUpdate()
      return
	}
	const result = await fetch('/.netlify/functions/updateTodo', {
		method: 'PUT',
		body: JSON.stringify({
			id: selectedTodoId,
			message: editTodoInput
		})
	})
    setIsEditMode(false)
    setEditTodoInput("")
    fun();
  }

  const handleCancelUpdate = e => {
    e.preventDefault()
    setIsEditMode(false)
  }

  const handleToggle = () => {
    if (!selectedTodoId || !selectedTodo) return
  }

  const handleDelete = async () => {
	if (!selectedTodoId) return
	const result = await fetch('/.netlify/functions/deleteTodo', { 
		method: 'DELETE', 
		body: JSON.stringify(selectedTodoId)
   })
   fun();

  }

  return (
    <div className="App">
      <div className="App__header">
        <h1>Todo App</h1>
        <form onSubmit={handleCreateNewTodo}>
          <label htmlFor="new-todo">Add new:</label>
          <input
            onChange={handleNewInputChange}
            id="new-todo"
            value={newTodoInput}
          />
          <button type="submit" className= "createButton">Create</button>
        </form>
      </div>
      <div className="App__body">
        <div>
        <ul className="App__list">
          <h2>My Todos:</h2>
          {todos?
            todos.map((todo, i) => (
              <li
                className={`${
                  todo.id === selectedTodoId ? "active" : ""
                }`}
                key={todo.ref["@ref"].id}
                onClick={() => setSelectedTodoId(todo.ref["@ref"].id)}
              >
                <span className="list-number">{i + 1})</span> {todo.data.message}
              </li>
            )): 
            <div>No Todo Found</div>}
          
        </ul>
        </div>
        <div className="App_todo-info">
          <h2>Selected Todo:</h2>
          {selectedTodo === null ? (
            <span className="empty-state">No Todo Selected</span>
          ) : !isEditMode ? (
            <>
              <span
                className={`todo-desc`}
              >
                {selectedTodo.message}  
              </span>
              <div className="todo-actions">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleToggle}>Toggle</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <label htmlFor="edit-todo">Edit:</label>
              <input
                ref={editInput}
                onChange={handleEditInputChange}
                value={editTodoInput}
              />
              <button type="submit">Update</button>
              <button onClick={handleCancelUpdate}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
