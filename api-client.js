const API_BASE_URL = "http://localhost:3000/api/v1/tasks";

window.apiClient = {
  async getTasks() {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error("No se pudieron cargar las tareas");
    }

    return response.json();
  },

  async createTask(taskData) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "No se pudo crear la tarea");
    }

    return data;
  },

  async updateTask(id, taskData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "No se pudo actualizar la tarea");
    }

    return data;
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorMessage = "No se pudo eliminar la tarea";

      try {
        const data = await response.json();
        errorMessage = data.message || data.error || errorMessage;
      } catch {
        // ignore
      }

      throw new Error(errorMessage);
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "No se pudieron completar todas las tareas");
    }

    return data;
  },

  async uncompleteAllTasks() {
    const response = await fetch(API_BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "uncomplete_all" }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "No se pudieron desmarcar todas las tareas");
    }

    return data;
  },

  async clearAllTasks() {
    const response = await fetch(`${API_BASE_URL}?scope=all`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorMessage = "No se pudieron borrar todas las tareas";

      try {
        const data = await response.json();
        errorMessage = data.message || data.error || errorMessage;
      } catch {
        // ignore
      }

      throw new Error(errorMessage);
    }

    return true;
  },

  async clearCompletedTasks() {
    const response = await fetch(`${API_BASE_URL}?scope=completed`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let errorMessage = "No se pudieron borrar las tareas completadas";

      try {
        const data = await response.json();
        errorMessage = data.message || data.error || errorMessage;
      } catch {
        // ignore
      }

      throw new Error(errorMessage);
    }

    return true;
  },
};