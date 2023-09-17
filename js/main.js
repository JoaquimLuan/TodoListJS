function toggleForm() {
  const formContainer = document.querySelector('.form-container');
  formContainer.style.display = formContainer.style.display === 'none' || formContainer.style.display === '' ? 'block' : 'none';
}

function toggleTaskList() {
  const taskList = document.querySelector('.task-list');
  taskList.style.display = taskList.style.display === 'none' || taskList.style.display === '' ? 'block' : 'none';
}

function isValidDate(date) {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
}

function isValidPriority(priority) {
  const priorityRegex = /^(Baixa|Média|Alta)$/;
  return priorityRegex.test(priority);
}

function isValidCategory(category) {
  const validCategories = ['Trabalho', 'Estudos', 'Lazer'];
  return validCategories.includes(category);
}

function isValidStatus(status) {
  const validStatuses = ['TODO', 'DOING', 'DONE'];
  return validStatuses.includes(status);
}

function addTask() {
  const taskName = document.getElementById('task-name').value;
  const taskDateInput = document.getElementById('task-date');
  const taskDate = taskDateInput.value;
  const taskPriority = document.getElementById('task-priority').value;
  const taskCategory = document.getElementById('task-category').value;
  const taskStatus = document.getElementById('task-status').value;
  const taskDescription = document.getElementById('task-description').value;


  function isValidDate(date) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
  }

  const formattedDate = taskDate.split('-').reverse().join('/');

  if (isValidDate(formattedDate)) {
    const task = {
      name: taskName,
      date: formattedDate,
      priority: taskPriority,
      category: taskCategory,
      status: taskStatus,
      description: taskDescription,
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('task-form').reset();

    renderTasks();
  } else {
    alert('Data inválida. Use o formato DD/MM/AAAA.');
  }
}

function renderTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskList = document.getElementById('task-list-container');

  taskList.innerHTML = '';

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
        <input type="checkbox" class="task-checkbox" value="${task.name}">
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

function batchAdvance() {
  const checkboxes = document.querySelectorAll('.task-checkbox:checked');

  checkboxes.forEach(checkbox => {
    const taskName = checkbox.value;
    advanceTask(taskName);
  });
}

function batchRevert() {
  const checkboxes = document.querySelectorAll('.task-checkbox:checked');

  checkboxes.forEach(checkbox => {
    const taskName = checkbox.value;
    revertTask(taskName);
  });
}

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

window.onload = renderTasks();
