const taskService = require('../services/task.service');

const getTasks = (req, res, next) => {
  try {
    const tasks = taskService.obtenerTodas();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const { titulo, completada = false } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      return res.status(400).json({
        error: 'El título es obligatorio y debe tener al menos 3 caracteres',
      });
    }

    if (typeof completada !== 'boolean') {
      return res.status(400).json({
        error: 'El campo completada debe ser booleano',
      });
    }

    const nuevaTarea = taskService.crearTarea({
      titulo: titulo.trim(),
      completada,
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'El id debe ser un número entero positivo',
      });
    }

    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
};