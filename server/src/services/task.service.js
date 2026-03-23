let tasks = [];
let currentId = 1;

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = ({ title, type = "escaleta", completed = false }) => {
  const nuevaTarea = {
    id: currentId++,
    title,
    type,
    completed,
    createdAt: new Date().toISOString(),
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const actualizarTarea = (id, data) => {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    throw new Error("NOT_FOUND");
  }

  if (typeof data.title !== "undefined") {
    task.title = data.title;
  }

  if (typeof data.type !== "undefined") {
    task.type = data.type;
  }

  if (typeof data.completed !== "undefined") {
    task.completed = data.completed;
  }

  return task;
};

const completarTodas = () => {
  tasks = tasks.map((task) => ({
    ...task,
    completed: true,
  }));

  return tasks;
};

const incompletarTodas = () => {
  tasks = tasks.map((task) => ({
    ...task,
    completed: false,
  }));

  return tasks;
};

const eliminarTodas = () => {
  tasks = [];
};

const eliminarCompletadas = () => {
  tasks = tasks.filter((task) => !task.completed);
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  tasks.splice(index, 1);
};

module.exports = {
  obtenerTodas,
  crearTarea,
  actualizarTarea,
  completarTodas,
  incompletarTodas,
  eliminarTodas,
  eliminarCompletadas,
  eliminarTarea,
};