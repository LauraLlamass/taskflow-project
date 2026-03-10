document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#task-form");
  const input = document.querySelector("#task-input");
  const list = document.querySelector("#task-list");
  const search = document.querySelector("#task-search");
  const clearBtn = document.querySelector("#tasks-clear");
  const clearCompletedBtn = document.querySelector("#clear-completed");
  const completeAllBtn = document.querySelector("#complete-all");
  const emptyMessage = document.querySelector("#empty-message");

  const progressText = document.querySelector("#progress-text");
  const progressBar = document.querySelector("#progress-bar");

  const totalEl = document.querySelector("#stats-total");
  const completedEl = document.querySelector("#stats-completed");
  const pendingEl = document.querySelector("#stats-pending");

  const toggleBtn = document.querySelector("#theme-toggle");
  const root = document.documentElement;

  const filterAllBtn = document.querySelector("#filter-all");
  const filterPendingBtn = document.querySelector("#filter-pending");
  const filterCompletedBtn = document.querySelector("#filter-completed");

  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme);

  /**
   * Aplica el tema guardado a la aplicación.
   * @param {string | null} style
   */
  function applyTheme(style) {
    if (style) {
      root.classList.add(style);
    }
    toggleBtn.textContent = style === "dark" ? "☀️" : "🌙";
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });

  let tasks = [];
  let currentFilter = "all";
  /**
   * Guarda las tareas en localStorage.
   */
  function saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (err) {
      console.warn("No se pudieron guardar las tareas:", err);
    }
  }

  /**
   * Carga las tareas desde localStorage.
   */
  function loadTasks() {
    try {
      const data = localStorage.getItem("tasks");
      tasks = data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn("No se pudieron cargar las tareas:", err);
      tasks = [];
    }
  }

  /**
   * Valida el título de una nueva tarea.
   * Comprueba que no esté vacío y que no esté duplicado.
   * @param {string} title
   * @returns {boolean}
   */
  function validateTask(title) {
    if (title === "") return false;
    return !tasks.some((task) => task.title.toLowerCase() === title.toLowerCase());
  }

  /**
   * Crea un nuevo objeto tarea.
   * @param {string} title
   * @returns {{id: number, title: string, completed: boolean, createdAt: string}}
   */
  function createTask(title) {
    return {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
  }

  /**
 * Actualiza el panel de estadísticas y la barra de progreso.
 */
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    totalEl.textContent = total;
    completedEl.textContent = completed;
    pendingEl.textContent = pending;

    if (progressText) {
      progressText.textContent = `${completed} / ${total} tareas completadas`;
    }

    if (progressBar) {
      const percentage = total === 0 ? 0 : (completed / total) * 100;
      progressBar.style.width = `${percentage}%`;

      if (percentage === 100) {
        progressBar.classList.remove("bg-[#B76E79]");
        progressBar.classList.add("bg-green-500");
      } else {
        progressBar.classList.remove("bg-green-500");
        progressBar.classList.add("bg-[#B76E79]");
      }
    }
  }

  /**
   * Elimina una tarea del array y del DOM.
   * @param {number} id
   * @param {HTMLLIElement} li
   */
  function deleteTask(id, li) {
    li.classList.add("borrando");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      updateStats();
      li.remove();
    }, 250);
  }

  /**
   * Cambia el estado completed de una tarea.
   * @param {number} id
   * @param {boolean} checked
   */
  function toggleTaskCompleted(id, checked) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: checked } : task
    );

    saveTasks();
    updateStats();
    renderTasks(search.value.toLowerCase());
  }

  /**
   * Marca todas las tareas como completadas.
   */
  function completeAllTasks() {
    tasks = tasks.map((task) => ({
      ...task,
      completed: true
    }));

    saveTasks();
    renderTasks(search.value.toLowerCase());
    updateStats();
  }

  /**
   * Crea el texto visible de una tarea.
   * @param {string} title
   * @param {boolean} completed
   * @returns {HTMLSpanElement}
   */
  function createTaskText(title, completed) {
    const span = document.createElement("span");
    span.textContent = title;
    span.className = completed
      ? "text-[#2E1F27] dark:text-slate-200 line-through opacity-60"
      : "text-[#2E1F27] dark:text-slate-200";
    return span;
  }

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  /**
   * Renderiza una tarea en el DOM.
   * @param {{id: number, title: string, completed: boolean, createdAt: string}} task
   */
  function renderTaskInDOM(task) {
    const li = document.createElement("li");
    li.className =
      "bg-white p-4 rounded-xl border border-black/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition flex flex-col gap-3 dark:bg-white/60";

    const topRow = document.createElement("div");
    topRow.className = "flex items-start gap-3";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "mt-1 h-4 w-4 accent-[#B76E79]";
    checkbox.setAttribute("aria-label", `Marcar tarea: ${task.title}`);

    checkbox.addEventListener("change", () => {
      toggleTaskCompleted(task.id, checkbox.checked);
    });

    const text = createTaskText(task.title, task.completed);

    topRow.appendChild(checkbox);
    topRow.appendChild(text);

    const meta = document.createElement("p");
    meta.className = "text-xs opacity-60";
    meta.textContent = `Creada: ${new Date(task.createdAt).toLocaleDateString("es-ES")}`;

    const button = document.createElement("button");
    button.textContent = "🗑️";
    button.className =
      "self-end p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-[#B76E79]/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]";
    button.setAttribute("aria-label", `Eliminar tarea: ${task.title}`);

    button.addEventListener("click", () => {
      deleteTask(task.id, li);
    });

    li.appendChild(topRow);
    li.appendChild(meta);
    li.appendChild(button);

    list.appendChild(li);
  }

  /**
   * Renderiza todas las tareas, opcionalmente filtradas por texto.
   * @param {string} query
   */
  function renderTasks(query = "") {
    list.innerHTML = "";

    let filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(query)
    );

    if (currentFilter === "pending") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    if (currentFilter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    filteredTasks.forEach((task) => renderTaskInDOM(task));
  }
  /**
   * Elimina todas las tareas.
   * @returns {boolean}
   */
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

  /**
 * Elimina todas las tareas completadas.
 */
  function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks(search.value.toLowerCase());
    updateStats();
  }

  loadTasks();
  renderTasks();
  updateStats();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = input.value.trim();
    if (!validateTask(title)) return;

    const newTask = createTask(title);
    tasks.unshift(newTask);

    saveTasks();
    renderTasks(search.value.toLowerCase());
    updateStats();

    input.value = "";
    input.focus();
  });

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
      renderTasks(search.value.toLowerCase());
    });
  }

  if (filterPendingBtn) {
    filterPendingBtn.addEventListener("click", () => {
      currentFilter = "pending";
      renderTasks(search.value.toLowerCase());
    });
  }

  if (filterCompletedBtn) {
    filterCompletedBtn.addEventListener("click", () => {
      currentFilter = "completed";
      renderTasks(search.value.toLowerCase());
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

});