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
      throw new Error(data.error || "No se pudo crear la tarea");
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
        errorMessage = data.error || errorMessage;
      } catch {
      }

      throw new Error(errorMessage);
    }
  },
};