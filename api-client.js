const isLocalFrontend =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalFrontend
  ? "http://localhost:3000/api/v1/tasks"
  : "/api/v1/tasks";

async function parseJsonSafe(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function parseError(response, fallbackMessage) {
  try {
    const data = await parseJsonSafe(response);
    return data?.message || data?.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

window.apiClient = {
  async getTasks() {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudieron cargar las tareas"));
    }

    const data = await parseJsonSafe(response);
    return data ?? [];
  },

  async createTask(taskData) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudo crear la tarea"));
    }

    const data = await parseJsonSafe(response);
    return data ?? taskData;
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudo actualizar la tarea"));
    }

    const data = await parseJsonSafe(response);
    return data ?? { id, ...taskData };
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudo eliminar la tarea"));
    }

    return true;
  },

  async completeAllTasks() {
    const response = await fetch(API_BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "complete_all" }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudieron completar todas las tareas"));
    }

    const data = await parseJsonSafe(response);
    return data ?? [];
  },

  async uncompleteAllTasks() {
    const response = await fetch(API_BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "uncomplete_all" }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudieron desmarcar todas las tareas"));
    }

    const data = await parseJsonSafe(response);
    return data ?? [];
  },

  async clearAllTasks() {
    const response = await fetch(`${API_BASE_URL}?scope=all`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudieron borrar todas las tareas"));
    }

    return true;
  },

  async clearCompletedTasks() {
    const response = await fetch(`${API_BASE_URL}?scope=completed`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "No se pudieron borrar las tareas completadas"));
    }

    return true;
  },
};