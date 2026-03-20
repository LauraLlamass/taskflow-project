const taskService = require('../services/task.service');

const getTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

const createTask = (req, res) => {
  const { titulo, completada = false } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    return res.status(400).json({
      error: 'El título es obligatorio y debe tener al menos 3 caracteres',
    });
  }

  if (typeof completada !== 'boolean') {
    return res.status(400).json({
      error: 'El campo completado debe ser booleano',
    });
  }

  const nuevaTarea = taskService.crearTarea({
    titulo: titulo.trim(),
    completada,
  });

  res.status(201).json(nuevaTarea);
};

const deleteTask = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'El id debe ser un número entero positivo',
    });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        error: 'Tarea no encontrada',
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
};