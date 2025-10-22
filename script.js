// Simple To-Do app (vanilla JS)
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const STORAGE_KEY = 'todo_items_v1';

// Load from localStorage
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;

  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn check';
  checkBtn.type = 'button';
  checkBtn.title = 'Toggle complete';
  checkBtn.textContent = todo.completed ? '✓' : '○';

  const text = document.createElement('span');
  text.className = 'todo-text' + (todo.completed ? ' completed' : '');
  text.textContent = todo.text;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn remove';
  removeBtn.type = 'button';
  removeBtn.title = 'Remove task';
  removeBtn.textContent = '🗑';

  checkBtn.addEventListener('click', () => {
    toggleComplete(todo.id);
  });

  removeBtn.addEventListener('click', () => {
    removeTodo(todo.id);
  });

  // Allow clicking text to toggle as well
  text.addEventListener('click', () => toggleComplete(todo.id));

  li.appendChild(checkBtn);
  li.appendChild(text);
  li.appendChild(removeBtn);
  return li;
}

function render() {
  list.innerHTML = '';
  if (todos.length === 0) {
    const p = document.createElement('p');
    p.className = 'small';
    p.textContent = 'No tasks yet. Add one above.';
    list.appendChild(p);
    return;
  }

  // Render tasks in order
  todos.forEach(todo => {
    const el = createTodoElement(todo);
    list.appendChild(el);
  });
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const todo = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };
  todos.unshift(todo); // newest on top
  save();
  render();
}

function toggleComplete(id) {
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return;
  todos[idx].completed = !todos[idx].completed;
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

// Allow keyboard shortcut: Ctrl+Enter to add when using multi-line (not present here) - keep for extensibility
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    // handled by form submit
    return;
  }
});

// initial render
render();
