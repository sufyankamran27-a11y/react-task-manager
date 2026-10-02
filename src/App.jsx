import React, { useState, useEffect } from 'react';

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('react_todo_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      { id: '1', text: 'Learn React Components & State', category: 'Study', priority: 'High', completed: false, date: '2026-10-05' },
      { id: '2', text: 'Build responsive portfolio website', category: 'Work', priority: 'Medium', completed: true, date: '2026-10-03' },
    ];
  });

  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('react_todo_data', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now().toString(),
      text: input.trim(),
      category,
      priority,
      completed: false,
      date
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos(todos.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
    setEditingId(null);
    setEditText('');
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase()) || 
                          todo.category.toLowerCase().includes(search.toLowerCase());
    if (filter === 'completed') return matchesSearch && todo.completed;
    if (filter === 'active') return matchesSearch && !todo.completed;
    return matchesSearch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Task Manager</h1>
          <p style={styles.subtitle}>Organize your daily tasks easily</p>
        </div>

        {/* Form */}
        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?..."
            style={styles.input}
          />
          
          <div style={styles.row}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
              <option value="General">📂 General</option>
              <option value="Work">💻 Work</option>
              <option value="Study">📚 Study</option>
              <option value="Personal">✨ Personal</option>
            </select>

            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
              <option value="High">🔥 High</option>
              <option value="Medium">⚡ Medium</option>
              <option value="Low">🌱 Low</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.select}
            />
          </div>

          <button type="submit" style={styles.addButton}>+ Add Task</button>
        </form>

        {/* Search & Filters */}
        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.tabs}>
            {['all', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: filter === tab ? '#6366f1' : '#1e293b',
                  color: filter === tab ? '#fff' : '#94a3b8'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div style={styles.taskList}>
          {filteredTodos.length === 0 ? (
            <p style={styles.noTask}>No tasks found.</p>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} style={{ ...styles.todoItem, opacity: todo.completed ? 0.6 : 1 }}>
                <div style={styles.todoLeft}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    style={styles.checkbox}
                  />
                  <div>
                    {editingId === todo.id ? (
                      <div style={styles.editRow}>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={styles.editInput}
                        />
                        <button onClick={() => saveEdit(todo.id)} style={styles.smallBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} style={styles.smallBtnRed}>X</button>
                      </div>
                    ) : (
                      <>
                        <p style={{ ...styles.todoText, textDecoration: todo.completed ? 'line-through' : 'none' }}>
                          {todo.text}
                        </p>
                        <div style={styles.badgeRow}>
                          <span style={styles.badge}>{todo.category}</span>
                          <span style={styles.badgePriority}>{todo.priority}</span>
                          <span style={styles.dateText}>{todo.date}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {editingId !== todo.id && (
                  <div style={styles.actionBtns}>
                    <button onClick={() => startEdit(todo)} style={styles.iconBtn}>✏️</button>
                    <button onClick={() => deleteTodo(todo.id)} style={styles.iconBtn}>🗑️</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={styles.footerInfo}>
          Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
        </div>

      </div>
    </div>
  );
}

// Clean inline CSS styles (No Tailwind required)
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    gap: '8px',
  },
  select: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#cbd5e1',
    fontSize: '12px',
    outline: 'none',
  },
  addButton: {
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
  },
  tabBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  noTask: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '20px',
  },
  todoItem: {
    backgroundColor: '#0f172a',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #334155',
  },
  todoLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    flex: 1,
  },
  checkbox: {
    marginTop: '3px',
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },
  todoText: {
    fontSize: '14px',
    margin: '0 0 6px 0',
    color: '#f8fafc',
    wordBreak: 'break-word',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    fontSize: '11px',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#334155',
    color: '#cbd5e1',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  badgePriority: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  dateText: {
    color: '#64748b',
  },
  actionBtns: {
    display: 'flex',
    gap: '6px',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
  },
  editRow: {
    display: 'flex',
    gap: '6px',
  },
  editInput: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #6366f1',
    backgroundColor: '#1e293b',
    color: '#fff',
    fontSize: '13px',
  },
  smallBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  smallBtnRed: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  footerInfo: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#64748b',
  },
};