const taskService = require("../services/task.service");

const ALLOWED_TYPES = ["escaleta", "corregir", "worldbuilding", "escribir"];

const getTasks = (req, res, next) => {
  try {
    const tasks = taskService.obtenerTodas();
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const { title, type, completed = false } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        error: "El título es obligatorio y debe tener al menos 3 caracteres",
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        error: "El campo completed debe ser booleano",
      });
    }

    if (type && !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        error: "El tipo de tarea no es válido",
      });
    }

    const nuevaTarea = taskService.crearTarea({
      title: title.trim(),
      type,
      completed,
    });

    return res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, type, completed } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El id debe ser un número entero positivo",
      });
    }

    if (
      typeof title === "undefined" &&
      typeof type === "undefined" &&
      typeof completed === "undefined"
    ) {
      return res.status(400).json({
        error: "Debes enviar al menos un campo para actualizar",
      });
    }

    if (typeof title !== "undefined") {
      if (typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({
          error: "El título debe tener al menos 3 caracteres",
        });
      }
    }

    const ALLOWED_TYPES = ["escaleta", "corregir", "worldbuilding", "escribir"];

    if (typeof type !== "undefined" && !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        error: "El tipo de tarea no es válido",
      });
    }

    if (typeof completed !== "undefined" && typeof completed !== "boolean") {
      return res.status(400).json({
        error: "El campo completed debe ser booleano",
      });
    }

    const updatedTask = taskService.actualizarTarea(id, {
      title: typeof title !== "undefined" ? title.trim() : undefined,
      type,
      completed,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const updateAllTasks = (req, res, next) => {
  try {
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({
        error: "La acción es obligatoria",
      });
    }

    if (action === "complete_all") {
      const updatedTasks = taskService.completarTodas();
      return res.status(200).json(updatedTasks);
    }

    if (action === "uncomplete_all") {
      const updatedTasks = taskService.incompletarTodas();
      return res.status(200).json(updatedTasks);
    }

    return res.status(400).json({
      error: "Acción no válida",
    });
  } catch (error) {
    next(error);
  }
};

const deleteManyTasks = (req, res, next) => {
  try {
    const { scope } = req.query;

    if (scope === "all") {
      taskService.eliminarTodas();
      return res.status(204).send();
    }

    if (scope === "completed") {
      taskService.eliminarCompletadas();
      return res.status(204).send();
    }

    return res.status(400).json({
      error: "El parámetro scope debe ser 'all' o 'completed'",
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El id debe ser un número entero positivo",
      });
    }

    taskService.eliminarTarea(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateAllTasks,
  deleteManyTasks,
  deleteTask,
};