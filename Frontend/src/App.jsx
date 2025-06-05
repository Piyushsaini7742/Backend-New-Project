import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    age: '',
    favoriteBookTitle: '',
    favoriteBookDescription: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        age: form.age,
        favoriteBook: {
          title: form.favoriteBookTitle,
          description: form.favoriteBookDescription
        }
      })
    });
    setForm({ name: '', age: '', favoriteBookTitle: '', favoriteBookDescription: '' });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const updateUser = async (id) => {
    const name = prompt('New name:');
    const age = prompt('New age:');
    const title = prompt('New book title:');
    const description = prompt('New book description:');

    if (!name || !age || !title || !description) return;

    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        age,
        favoriteBook: {
          title,
          description
        }
      })
    });

    fetchUsers();
  };

  return (
    <div style={{ padding: '20px' }}>

      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
        <input name="favoriteBookTitle" value={form.favoriteBookTitle} onChange={handleChange} placeholder="Book Title" required />
        <input name="favoriteBookDescription" value={form.favoriteBookDescription} onChange={handleChange} placeholder="Book Description" required />
        <button type="submit">Add User</button>
      </form>
      
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> (Age: {user.age})<br />
            Book: {user.favoriteBook.title} - {user.favoriteBook.description}<br />
            <button onClick={() => deleteUser(user._id)}>Delete</button>
            <button onClick={() => updateUser(user._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
