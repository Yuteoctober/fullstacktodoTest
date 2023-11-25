import { useState, useEffect } from 'react';
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editVal, setEditVal] = useState({});
  const [add, setAdd] = useState('');

  const url = `http://localhost:8080/todos`;
  
  const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.json();
      setTodos(data);
      
    };

  useEffect(() => {

    fetchData();

  }, []);
  

  const handleDelAll = async () => {
    try {
      await axios.delete(`${url}/all`);
      console.log('Delete successfully!')
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheck = async (complete, id, text) => {
    const completed = !complete
    try {
      const response = await axios.put(url + '/' + id, {complete: completed, _id: id, text: text})
      const updateComplete = response.data.complete

      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === id? {...todo, complete: updateComplete} : todo))
        fetchData()
    }
    
    catch(err) {
      console.log(err)
    }
  }


  const handleAdd = async() => {
    try {
     const response = await axios.post(url, {text: add})
     const addedText = response.data.text
     console.log(addedText)
     fetchData()
     
    }
    catch(err) {
      console.log(err)
    }
  }


  const handleEdit = async(e, id) => {
    // Check if the click target is an input field
    if (e.target.tagName.toLowerCase() === 'input') {
      e.stopPropagation();
      return;
    }
    setEditMode(editMode => ({
      ...editMode,
      [id]: !editMode[id],
    }));
  
    try {
      const response = await axios.put(`${url}/${id}`, { text: editVal[id], complete: false });
      const updatedText = response.data.text;
  
      setTodos(prevTodos => 
        prevTodos.map(todo =>
          todo._id === id ? { ...todo, text: updatedText } : todo
        )
      )
    
  
      setEditVal('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <>
      <div className="btn">
        <input type="text" onChange={(e) => setAdd(e.target.value)} value={add} />
        <button onClick={handleAdd}>ADD</button>
        <button onClick={handleDelAll}>Delete All</button>
      </div>
      {todos.map((todo) => (
        <>
          <input className='check' type="checkbox" onClick={() => handleCheck(todo.complete, todo._id, todo.text)} />
          <div className="Todo_items" key={todo._id}>
            <div className="edit" onClick={(e) => handleEdit(e, todo._id)}>
              {editMode[todo._id] && (
                <input
                  type="text"
                  value={editVal[todo._id]}
                  onChange={(e) => {
                    setEditVal({...editVal, [todo._id]: e.target.value});
                  }}
                />
              )}
              <span className='edit_sym'>{editMode[todo._id]? '':'...'}</span>
            </div>
            <p className={`${todo.complete? 'checked': ''}`}>{todo.text}</p>
          </div>
        </>
      ))}
    </>
  );
}

export default App;