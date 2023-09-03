function toggleForm() {
  let formContainer = document.querySelector('.form-container');
  formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
}

function toggleTaskList() {
  let taskList = document.querySelector('.task-list');
  taskList.style.display = taskList.style.display === 'none' || taskList.style.display === '' ? 'block' : 'none';
}

// Função para adicionar uma tarefa
function addTask() {
  const taskName = document.getElementById('task-name').value;
  const taskDate = document.getElementById('task-date').value;
  const taskPriority = document.getElementById('task-priority').value;
  const taskCategory = document.getElementById('task-category').value;
  const taskStatus = document.getElementById('task-status').value;
  const taskDescription = document.getElementById('task-description').value;

  const task = {
    name: taskName,
    date: taskDate,
    priority: taskPriority,
    category: taskCategory,
    status: taskStatus,
    description: taskDescription,
  };

  // Verifica se já tem uma tarefas salva no localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // AdicionA a nova tarefa à lista
  tasks.push(task);

  // Salva a lista atualizada no localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Limpa os campos do formulário
  document.getElementById('task-form').reset();

  // Atualiza a lista de tarefas exibida na página
  renderTasks();
}

// Função para exibir tarefas na página
function renderTasks() {

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskList = document.getElementById('task-list-container');

  taskList.innerHTML = '';

  // Criar colunas para categorias "TODO," "DOING," e "DONE"
  const categories = ['TODO', 'DOING', 'DONE'];

  categories.forEach(category => {
    const column = document.createElement('div');
    column.classList.add('task-column');
    column.innerHTML = `<h3>${category}</h3>`;

    const categoryTasks = tasks.filter(task => task.status === category);

    categoryTasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task');
      taskItem.dataset.status = category;
      taskItem.innerHTML = `
        <strong>Tarefa:</strong> ${task.name}<br>
        <strong>Data:</strong> ${task.date}<br>
        <strong>Prioridade:</strong> ${task.priority}<br>
        <strong>Categoria:</strong> ${task.category}<br>
        <strong>Status:</strong> ${task.status}<br>
        <strong>Descrição:</strong> ${task.description}<br>
        <button onclick="removeTask('${task.name}')">Remover</button>
        <button onclick="advanceTask('${task.name}')">Avançar</button>
        <button onclick="revertTask('${task.name}')">Reverter</button>
        <button onclick="editTask('${task.name}')">Editar</button>
      `;

      column.appendChild(taskItem);
    });

    taskList.appendChild(column);
  });
}

// Função para remover uma tarefa
function removeTask(taskName) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks = tasks.filter(task => task.name !== taskName);

  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
}

function advanceTask(taskName) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const taskIndex = tasks.findIndex(task => task.name === taskName);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    if (task.status === 'TODO') {
      // Avançar de "TODO" para "DOING"
      task.status = 'DOING';
    } else if (task.status === 'DOING') {
      // Avançar de "DOING" para "DONE"
      task.status = 'DONE';
    }

    tasks[taskIndex] = task;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
  }
}

function revertTask(taskName) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const taskIndex = tasks.findIndex(task => task.name === taskName);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    if (task.status === 'DOING') {
      // Voltar de "DOING" para "TODO"
      task.status = 'TODO';
    } else if (task.status === 'DONE') {
      // Voltar de "DONE" para "DOING"
      task.status = 'DOING';
    }

    tasks[taskIndex] = task;

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
  }
}

function editTask(taskName) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.name === taskName);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];

    document.getElementById('task-name').value = task.name;
    document.getElementById('task-date').value = task.date;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-category').value = task.category;
    document.getElementById('task-status').value = task.status;
    document.getElementById('task-description').value = task.description;

    tasks = tasks.filter(task => task.name !== taskName);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
  }
}


// Exibir as tarefas quando a página carregar
window.onload = renderTasks();
