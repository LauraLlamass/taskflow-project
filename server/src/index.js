const cors = require('cors');
const express = require('express');
const { PORT } = require('./config/env');
const app = express();
app.use(cors());

app.use(express.json());

let tasks = [];
let currentId = 1;

app.get('/', (req, res) => {
  res.send('Funciona API');
});

app.get('/api/v1/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/v1/tasks', (req, res) => {
  const { titulo, completada = false } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    return res.status(400).json({
      error: 'El título es obligatorio y debe tener al menos 3 caracteres'
    });
  }

  if (typeof completada !== 'boolean') {
    return res.status(400).json({
      error: 'El campo completada debe ser booleano'
    });
  }

  const nuevaTarea = {
    id: currentId++,
    titulo: titulo.trim(),
    completada,
  };

  tasks.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

app.delete('/api/v1/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Tarea no encontrada'
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});