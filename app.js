document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-input");
  const list = document.querySelector("#task-list");
  const taskType = document.querySelector("#task-type");
  const search = document.querySelector("#task-search");
  const clearBtn = document.querySelector("#clear-all");
  const clearCompletedBtn = document.querySelector("#clear-completed");
  const completeAllBtn = document.querySelector("#mark-all-complete");
  const uncompleteAllBtn = document.querySelector("#mark-all-incomplete");
  const emptyMessage = document.querySelector("#empty-message");
  const filterType = document.querySelector("#filter-type");

  const progressText = document.querySelector("#progress-text");
  const progressBar = document.querySelector("#progress-bar");

  const totalEl = document.querySelector("#stats-total");
  const completedEl = document.querySelector("#stats-completed");
  const pendingEl = document.querySelector("#stats-pending");

  const toggleBtn = document.querySelector("#theme-toggle");
  const body = document.body;

  const filterAllBtn = document.querySelector("#filter-status-all");
  const filterPendingBtn = document.querySelector("#filter-status-pending");
  const filterCompletedBtn = document.querySelector("#filter-status-completed");

  let tasks = [];
  let currentFilter = "all";
  let currentTypeFilter = "all";

  const DEFAULT_TYPE = "escaleta";
  const STORAGE_KEYS = {
    tasks: "tasks",
    theme: "theme",
  };

  function getSearchQuery() {
    return search ? search.value.trim().toLowerCase() : "";
  }

  function refreshUI() {
    renderTasks(getSearchQuery());
    updateStats();
    updateFilterButtons();
    updateDocumentTitle();
  }

  function showMessage(message) {
    window.alert(message);
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error al guardar tareas:", error);
    }
  }

  function loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.tasks);
      tasks = data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn("No se pudieron cargar las tareas:", error);
      tasks = [];
    }
  }

  function applyTheme(theme) {
    body.classList.toggle("dark", theme === "dark");

    if (toggleBtn) {
      toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      toggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  function toggleTheme() {
    const isDark = body.classList.toggle("dark");
    const newTheme = isDark ? "dark" : "light";

    localStorage.setItem(STORAGE_KEYS.theme, newTheme);

    if (toggleBtn) {
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
      toggleBtn.setAttribute("aria-pressed", String(isDark));
    }
  }

  function normalizeTitle(title) {
    return typeof title === "string" ? title.trim() : "";
  }

  function isDuplicateTitle(title, excludeId = null) {
    const normalizedTitle = normalizeTitle(title).toLowerCase();

    return tasks.some((task) => {
      const sameId = excludeId !== null && task.id === excludeId;
      return !sameId && task.title.trim().toLowerCase() === normalizedTitle;
    });
  }

  function validateNewTask(title) {
    const normalizedTitle = normalizeTitle(title);

    if (!normalizedTitle) {
      return {
        valid: false,
        message: "La tarea no puede estar vacía.",
      };
    }

    if (isDuplicateTitle(normalizedTitle)) {
      return {
        valid: false,
        message: "Ya existe una tarea con ese nombre.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  }

  function validateEditedTask(id, title) {
    const normalizedTitle = normalizeTitle(title);

    if (!normalizedTitle) {
      return {
        valid: false,
        message: "El título no puede estar vacío.",
      };
    }

    if (isDuplicateTitle(normalizedTitle, id)) {
      return {
        valid: false,
        message: "Ya existe otra tarea con ese nombre.",
      };
    }

    return {
      valid: true,
      message: "",
    };
  }

  function createTask(title, type) {
    return {
      id: Date.now(),
      title: normalizeTitle(title),
      type: type || DEFAULT_TYPE,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  }

  function editTask(id, newTitle) {
    const normalizedTitle = normalizeTitle(newTitle);
    const validation = validateEditedTask(id, normalizedTitle);

    if (!validation.valid) {
      showMessage(validation.message);
      return;
    }

    const taskToEdit = tasks.find((task) => task.id === id);
    if (!taskToEdit) return;

    taskToEdit.title = normalizedTitle;
    saveTasks();
    refreshUI();
  }

  function deleteTask(id, li) {
    li.classList.add("borrando");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      refreshUI();
    }, 250);
  }

  function toggleTaskCompleted(id, checked) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: checked } : task
    );

    saveTasks();
    refreshUI();
  }

  function completeAllTasks() {
    tasks = tasks.map((task) => ({
      ...task,
      completed: true,
    }));

    saveTasks();
    refreshUI();
  }

  function uncompleteAllTasks() {
    tasks = tasks.map((task) => ({
      ...task,
      completed: false,
    }));

    saveTasks();
    refreshUI();
  }

  function clearAllTasks() {
    try {
      localStorage.removeItem(STORAGE_KEYS.tasks);
      tasks = [];
      return true;
    } catch (error) {
      console.warn("No se pudieron eliminar las tareas:", error);
      return false;
    }
  }

  function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    refreshUI();
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
    return (task.type || DEFAULT_TYPE) === type;
  }

  function getFilteredTasks(query = "") {
    return tasks
      .filter((task) => matchesQuery(task, query))
      .filter((task) => matchesStatusFilter(task, currentFilter))
      .filter((task) => matchesTypeFilter(task, currentTypeFilter));
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
    if (!progressText) return;
    progressText.textContent = `${completed} / ${total} tareas completadas`;
  }

  function renderProgressBar({ percentage }) {
    if (!progressBar) return;

    progressBar.style.width = `${percentage}%`;
    progressBar.style.background = percentage === 100 && percentage > 0
      ? "#6BBF9E"
      : "#B76E79";
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

    if (clearCompletedBtn) {
      const hasCompleted = tasks.some((task) => task.completed);
      clearCompletedBtn.style.display = hasCompleted ? "inline-flex" : "none";
    }

    if (clearBtn) {
      clearBtn.style.display = tasks.length > 0 ? "inline-flex" : "none";
    }
  }

  function updateStats() {
    const stats = getTaskStats(tasks);
    renderTaskStats(stats);
    renderProgressText(stats);
    renderProgressBar(stats);
    updateActionButtons();
  }

  function updateDocumentTitle() {
    const pending = tasks.filter((task) => !task.completed).length;

    if (pending === 0) {
      document.title = "TaskFlow - Escritura de novelas";
      return;
    }

    document.title = `${pending} tarea${pending === 1 ? "" : "s"} pendiente${pending === 1 ? "" : "s"} - TaskFlow`;
  }

  function updateFilterButtons() {
    const filterButtons = [
      { element: filterAllBtn, value: "all" },
      { element: filterPendingBtn, value: "pending" },
      { element: filterCompletedBtn, value: "completed" },
    ];

    filterButtons.forEach(({ element, value }) => {
      if (!element) return;
      element.classList.toggle("active", currentFilter === value);
    });
  }

  function getTypeLabel(type) {
    return type || DEFAULT_TYPE;
  }

  function getTypeClass(type) {
    return `task-type task-type--${type || DEFAULT_TYPE}`;
  }

  function createTaskElement(task) {
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

    content.append(text, meta, typeBadge);

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

    actions.append(editButton, deleteButton);
    li.append(checkbox, content, actions);

    return li;
  }

  function renderTasks(query = "") {
    if (!list) return;

    list.innerHTML = "";

    const filteredTasks = getFilteredTasks(query);
    const fragment = document.createDocumentFragment();

    filteredTasks.forEach((task) => {
      fragment.appendChild(createTaskElement(task));
    });

    list.appendChild(fragment);

    if (emptyMessage) {
      emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";
    }
  }

  function setStatusFilter(filter) {
    currentFilter = filter;
    refreshUI();
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "light";
    applyTheme(savedTheme);
  }

  function initializeApp() {
    loadTasks();
    initializeTheme();
    refreshUI();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = normalizeTitle(input.value);
      const validation = validateNewTask(title);

      if (!validation.valid) {
        showMessage(validation.message);
        input.focus();
        return;
      }

      const newTask = createTask(title, taskType.value);
      tasks.unshift(newTask);

      saveTasks();
      refreshUI();

      input.value = "";
      taskType.value = DEFAULT_TYPE;
      input.focus();
    });
  }

  if (search) {
    search.addEventListener("input", refreshUI);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const ok = window.confirm(
        "¿Seguro que quieres borrar todas las tareas? Esta acción no se puede deshacer."
      );
      if (!ok) return;
      if (!clearAllTasks()) return;

      if (search) search.value = "";
      refreshUI();
      input.focus();
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
    completeAllBtn.addEventListener("click", completeAllTasks);
  }

  if (uncompleteAllBtn) {
    uncompleteAllBtn.addEventListener("click", uncompleteAllTasks);
  }

  if (filterAllBtn) {
    filterAllBtn.addEventListener("click", () => setStatusFilter("all"));
  }

  if (filterPendingBtn) {
    filterPendingBtn.addEventListener("click", () => setStatusFilter("pending"));
  }

  if (filterCompletedBtn) {
    filterCompletedBtn.addEventListener("click", () => setStatusFilter("completed"));
  }

  if (filterType) {
    filterType.addEventListener("change", () => {
      currentTypeFilter = filterType.value;
      refreshUI();
    });
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".task-card");
    if (!card) return;

    const checkbox = card.querySelector(".task-checkbox");
    if (!checkbox) return;

    if (event.target.classList.contains("task-checkbox")) return;
    if (event.target.closest(".task-actions")) return;

    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });

  initializeApp();
});