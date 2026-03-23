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
  const networkStatus = document.querySelector("#network-status");

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
  let isLoading = false;
  let errorMessage = "";

  const DEFAULT_TYPE = "escaleta";
  const STORAGE_KEYS = {
    theme: "theme",
  };

  function getSearchQuery() {
    return search ? search.value.trim().toLowerCase() : "";
  }

  function refreshUI() {
    renderNetworkState();
    renderTasks(getSearchQuery());
    updateStats();
    updateFilterButtons();
    updateDocumentTitle();
  }

  function showMessage(message) {
    window.alert(message);
  }

  function renderNetworkState() {
    if (!networkStatus) return;

    networkStatus.textContent = "";
    networkStatus.className = "network-status";

    if (isLoading) {
      networkStatus.textContent = "Cargando...";
      networkStatus.classList.add("is-loading");
      return;
    }

    if (errorMessage) {
      networkStatus.textContent = errorMessage;
      networkStatus.classList.add("is-error");
      return;
    }

    if (tasks.length >= 0) {
      networkStatus.textContent = "Servidor conectado correctamente";
      networkStatus.classList.add("is-success");
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



  async function editTask(id, newTitle) {
    const normalizedTitle = normalizeTitle(newTitle);
    const validation = validateEditedTask(id, normalizedTitle);

    if (!validation.valid) {
      showMessage(validation.message);
      return false;
    }

    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      const updatedTask = await window.apiClient.updateTask(id, {
        title: normalizedTitle,
      });

      tasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      );

      return true;
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudo editar la tarea.";
      showMessage(errorMessage);
      return false;
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  async function deleteTask(id, li) {
    li.classList.add("borrando");

    setTimeout(async () => {
      try {
        isLoading = true;
        errorMessage = "";
        refreshUI();

        await window.apiClient.deleteTask(id);
        tasks = tasks.filter((task) => task.id !== id);
      } catch (error) {
        console.error(error);
        errorMessage = error.message || "No se pudo eliminar la tarea.";
        showMessage(errorMessage);
        li.classList.remove("borrando");
      } finally {
        isLoading = false;
        refreshUI();
      }
    }, 250);
  }

  async function toggleTaskCompleted(id, checked) {
    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      const updatedTask = await window.apiClient.updateTask(id, {
        completed: checked,
      });

      tasks = tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      );
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudo actualizar la tarea.";
      showMessage(errorMessage);
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  async function completeAllTasks() {
    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      const updatedTasks = await window.apiClient.completeAllTasks();
      tasks = updatedTasks;
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudieron completar todas las tareas.";
      showMessage(errorMessage);
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  async function uncompleteAllTasks() {
    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      const updatedTasks = await window.apiClient.uncompleteAllTasks();
      tasks = updatedTasks;
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudieron desmarcar todas las tareas.";
      showMessage(errorMessage);
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  async function clearAllTasks() {
    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      await window.apiClient.clearAllTasks();
      tasks = [];
      return true;
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudieron borrar todas las tareas.";
      showMessage(errorMessage);
      return false;
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  async function clearCompletedTasks() {
    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      await window.apiClient.clearCompletedTasks();
      tasks = tasks.filter((task) => !task.completed);
    } catch (error) {
      console.error(error);
      errorMessage = error.message || "No se pudieron borrar las tareas completadas.";
      showMessage(errorMessage);
    } finally {
      isLoading = false;
      refreshUI();
    }
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
  return (type || DEFAULT_TYPE).toUpperCase();
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
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (content.querySelector(".task-edit-form")) return;

      text.classList.add("task-hidden");
      meta.classList.add("task-hidden");
      typeBadge.classList.add("task-hidden");

      const editForm = document.createElement("form");
      editForm.className = "task-edit-form";

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "task-edit-input";
      editInput.value = task.title;

      const inlineActions = document.createElement("div");
      inlineActions.className = "task-edit-actions-inline";

      const saveButton = document.createElement("button");
      saveButton.type = "submit";
      saveButton.className = "btn btn-primary";
      saveButton.textContent = "Guardar";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "btn btn-secondary";
      cancelButton.textContent = "Cancelar";

      cancelButton.addEventListener("click", (event) => {
        event.stopPropagation();
        editForm.remove();
        text.classList.remove("task-hidden");
        meta.classList.remove("task-hidden");
        typeBadge.classList.remove("task-hidden");
      });

      editForm.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const updated = await editTask(task.id, editInput.value);

        if (updated) {
          editForm.remove();
          text.classList.remove("task-hidden");
          meta.classList.remove("task-hidden");
          typeBadge.classList.remove("task-hidden");
        }
      });

      editInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          editForm.remove();
          text.classList.remove("task-hidden");
          meta.classList.remove("task-hidden");
          typeBadge.classList.remove("task-hidden");
        }
      });

      inlineActions.append(saveButton, cancelButton);
      editForm.append(editInput, inlineActions);
      content.prepend(editForm);

      editInput.focus();
      editInput.select();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "task-delete";
    deleteButton.textContent = "🗑️";
    deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);

    deleteButton.addEventListener("click", async () => {
      const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta tarea?");
      if (!confirmDelete) return;
      await deleteTask(task.id, li);
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

  async function initializeApp() {
    initializeTheme();

    try {
      isLoading = true;
      errorMessage = "";
      refreshUI();

      tasks = await window.apiClient.getTasks();
    } catch (error) {
      console.error("No se pudieron cargar las tareas:", error);
      errorMessage = "No se pudieron cargar las tareas del servidor.";
      showMessage(errorMessage);
      tasks = [];
    } finally {
      isLoading = false;
      refreshUI();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

   if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = normalizeTitle(input.value);
      const validation = validateNewTask(title);

      if (!validation.valid) {
        showMessage(validation.message);
        input.focus();
        return;
      }

      try {
        isLoading = true;
        errorMessage = "";
        refreshUI();

        const newTask = await window.apiClient.createTask({
          title,
          type: taskType.value || DEFAULT_TYPE,
          completed: false,
        });

        tasks.unshift(newTask);

        input.value = "";
        taskType.value = DEFAULT_TYPE;
        input.focus();
      } catch (error) {
        console.error(error);
        errorMessage = error.message || "No se pudo crear la tarea.";
        showMessage(errorMessage);
      } finally {
        isLoading = false;
        refreshUI();
      }
    });
  }

  if (search) {
    search.addEventListener("input", refreshUI);
  }

if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    const ok = window.confirm(
      "¿Seguro que quieres borrar todas las tareas? Esta acción no se puede deshacer."
    );
    if (!ok) return;

    const deleted = await clearAllTasks();
    if (!deleted) return;

    if (search) search.value = "";
    refreshUI();
    input.focus();
  });
}

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener("click", async () => {
    const ok = window.confirm("¿Seguro que quieres borrar todas las tareas completadas?");
    if (!ok) return;
    await clearCompletedTasks();
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
  if (event.target.closest(".task-edit-form")) return;

  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event("change"));

    initializeApp();

});
});
