document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-input");
  const list = document.querySelector("#task-list");
  const taskType = document.querySelector("#task-type");
  const search = document.querySelector("#task-search");
  const clearBtn = document.querySelector("#tasks-clear");
  const clearCompletedBtn = document.querySelector("#clear-completed");
  const completeAllBtn = document.querySelector("#complete-all");
  const uncompleteAllBtn = document.querySelector("#uncomplete-all");
  const emptyMessage = document.querySelector("#empty-message");
  const filterType = document.querySelector("#filter-type");

  const progressText = document.querySelector("#progress-text");
  const progressBar = document.querySelector("#progress-bar");

  const totalEl = document.querySelector("#stats-total");
  const completedEl = document.querySelector("#stats-completed");
  const pendingEl = document.querySelector("#stats-pending");

  const toggleBtn = document.querySelector("#theme-toggle");
  const body = document.body;

  const filterAllBtn = document.querySelector("#filter-all");
  const filterPendingBtn = document.querySelector("#filter-pending");
  const filterCompletedBtn = document.querySelector("#filter-completed");

  let tasks = [];
  let currentFilter = "all";
  let currentTypeFilter = "all";

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  function applyTheme(style) {
    body.classList.remove("dark");

    if (style === "dark") {
      body.classList.add("dark");
    }

    if (toggleBtn) {
      toggleBtn.textContent = style === "dark" ? "☀️" : "🌙";
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = body.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }

  function saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error al guardar tareas:", error);
    }
  }

  function loadTasks() {
    try {
      const data = localStorage.getItem("tasks");
      tasks = data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn("No se pudieron cargar las tareas:", err);
      tasks = [];
    }
  }

  function validateTask(title) {
    if (typeof title !== "string") return false;

    const normalizedTitle = title.trim();
    if (!normalizedTitle) return false;

    const lowerTitle = normalizedTitle.toLowerCase();

    return !tasks.some(
      (task) => task.title.trim().toLowerCase() === lowerTitle
    );
  }

  function validateEditedTask(id, title) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) return false;

    return !tasks.some(
      (task) =>
        task.id !== id &&
        task.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
    );
  }

  function editTask(id, newTitle) {
    const normalizedTitle = newTitle.trim();

    if (!validateEditedTask(id, normalizedTitle)) {
      alert("El título no puede estar vacío ni duplicado.");
      return;
    }

    const taskToEdit = tasks.find((task) => task.id === id);
    if (!taskToEdit) return;

    taskToEdit.title = normalizedTitle;

    saveTasks();
    renderTasks(search ? search.value.toLowerCase() : "");
    updateStats();
  }

  function createTask(title, type) {
    return {
      id: Date.now(),
      title,
      type,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  }

  function getTaskStats(taskList) {
    const total = taskList.length;
    const completed = taskList.filter((task) => task.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    return { total, completed, pending, percentage };
  }

  function renderTaskStats({ total, completed, pending }) {
    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (pendingEl) pendingEl.textContent = pending;
  }

  function renderProgressText({ total, completed }) {
    if (progressText) {
      progressText.textContent = `${completed} / ${total} tareas completadas`;
    }
  }

  function renderProgressBar({ percentage }) {
    if (!progressBar) return;

    progressBar.style.width = `${percentage}%`;
    progressBar.style.background = percentage === 100 && percentage > 0
      ? "#6BBF9E"
      : "#B76E79";
  }

  function updateStats() {
  const stats = getTaskStats(tasks);
  renderTaskStats(stats);
  renderProgressText(stats);
  renderProgressBar(stats);
  updateActionButtons();
}

function updateActionButtons() {
  if (completeAllBtn) {
    const hasPending = tasks.some((task) => !task.completed);
    completeAllBtn.style.display = hasPending ? "inline-flex" : "none";
  }

  if (uncompleteAllBtn) {
    const hasCompleted = tasks.some((task) => task.completed);
    uncompleteAllBtn.style.display = hasCompleted ? "inline-flex" : "none";
  }
}

  function deleteTask(id, li) {
    li.classList.add("borrando");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks(search ? search.value.toLowerCase() : "");
      updateStats();
    }, 250);
  }

  function toggleTaskCompleted(id, checked) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: checked } : task
    );

    saveTasks();
    renderTasks(search ? search.value.toLowerCase() : "");
    updateStats();
  }

  function completeAllTasks() {
    tasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));

    saveTasks();
    renderTasks(search ? search.value.toLowerCase() : "");
    updateStats();
  }

  function uncompleteAllTasks() {
  tasks = tasks.map((task) => ({
    ...task,
    completed: false,
  }));

  saveTasks();
  renderTasks(search ? search.value.toLowerCase() : "");
  updateStats();
}

  function matchesQuery(task, query) {
    return task.title.toLowerCase().includes(query);
  }

  function matchesStatusFilter(task, filter) {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }

  function matchesTypeFilter(task, type) {
    if (type === "all") return true;
    return (task.type || "escaleta") === type;
  }

  function getFilteredTasks(query = "") {
    return tasks
      .filter((task) => matchesQuery(task, query))
      .filter((task) => matchesStatusFilter(task, currentFilter))
      .filter((task) => matchesTypeFilter(task, currentTypeFilter));
  }

  function getTypeLabel(type) {
    return type || "escaleta";
  }

  function getTypeClass(type) {
    return `task-type task-type--${type || "escaleta"}`;
  }

  function renderTaskInDOM(task) {
    const li = document.createElement("li");
    li.className = task.completed ? "task-card task-completed" : "task-card";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "task-checkbox";
    checkbox.setAttribute("aria-label", `Marcar tarea: ${task.title}`);

    checkbox.addEventListener("change", () => {
      toggleTaskCompleted(task.id, checkbox.checked);
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.title;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = `Creada: ${new Date(task.createdAt).toLocaleDateString("es-ES")}`;

    const typeBadge = document.createElement("span");
    typeBadge.className = getTypeClass(task.type);
    typeBadge.textContent = getTypeLabel(task.type);

    content.appendChild(text);
    content.appendChild(meta);
    content.appendChild(typeBadge);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "task-edit";
    editButton.textContent = "✏️";
    editButton.setAttribute("aria-label", `Editar tarea: ${task.title}`);

    editButton.addEventListener("click", () => {
      const newTitle = window.prompt("Edita el título de la tarea:", task.title);
      if (newTitle === null) return;
      editTask(task.id, newTitle);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-delete";
    deleteButton.textContent = "🗑️";
    deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);

    deleteButton.addEventListener("click", () => {
      const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta tarea?");
      if (!confirmDelete) return;
      deleteTask(task.id, li);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    list.appendChild(li);
  }

  function renderTasks(query = "") {
    list.innerHTML = "";

    const filteredTasks = getFilteredTasks(query);
    filteredTasks.forEach((task) => renderTaskInDOM(task));

    if (emptyMessage) {
      emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";
    }
  }

  function clearAllTasks() {
    try {
      localStorage.removeItem("tasks");
      tasks = [];
      return true;
    } catch (err) {
      console.warn("No se pudieron eliminar las tareas:", err);
      return false;
    }
  }

  function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks(search ? search.value.toLowerCase() : "");
    updateStats();
  }

  loadTasks();
  renderTasks();
  updateStats();

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = input.value.trim();
      if (!validateTask(title)) return;

      const type = taskType.value;
      const newTask = createTask(title, type);

      tasks.unshift(newTask);

      saveTasks();
      renderTasks(search ? search.value.toLowerCase() : "");
      updateStats();

      input.value = "";
      taskType.value = "escaleta";
      input.focus();
    });
  }

  if (search) {
    search.addEventListener("input", () => {
      renderTasks(search.value.toLowerCase());
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const ok = window.confirm(
        "¿Seguro que quieres borrar todas las tareas? Esta acción no se puede deshacer."
      );
      if (!ok) return;
      if (!clearAllTasks()) return;

      renderTasks();
      updateStats();
      if (search) search.value = "";
      input.focus();
    });
  }

  if (filterAllBtn) {
    filterAllBtn.addEventListener("click", () => {
      currentFilter = "all";
      renderTasks(search ? search.value.toLowerCase() : "");
    });
  }

  if (filterPendingBtn) {
    filterPendingBtn.addEventListener("click", () => {
      currentFilter = "pending";
      renderTasks(search ? search.value.toLowerCase() : "");
    });
  }

  if (filterCompletedBtn) {
    filterCompletedBtn.addEventListener("click", () => {
      currentFilter = "completed";
      renderTasks(search ? search.value.toLowerCase() : "");
    });
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      const ok = window.confirm("¿Seguro que quieres borrar todas las tareas completadas?");
      if (!ok) return;
      clearCompletedTasks();
    });
  }

  if (completeAllBtn) {
    completeAllBtn.addEventListener("click", () => {
      completeAllTasks();
    });
  }

  if (uncompleteAllBtn) {
  uncompleteAllBtn.addEventListener("click", () => {
    uncompleteAllTasks();
  });
}

  if (filterType) {
    filterType.addEventListener("change", () => {
      currentTypeFilter = filterType.value;
      renderTasks(search ? search.value.toLowerCase() : "");
    });
  }

  document.addEventListener("click", function(e) {

  const card = e.target.closest(".task-card");
  if (!card) return;

  const checkbox = card.querySelector(".task-checkbox");
  if (!checkbox) return;

  // evitar doble activación si se pulsa el checkbox
  if (e.target.classList.contains("task-checkbox")) return;

  checkbox.checked = !checkbox.checked;

  // dispara el evento change por si tu app lo usa
  checkbox.dispatchEvent(new Event("change"));

});

});