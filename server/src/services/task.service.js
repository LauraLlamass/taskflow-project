let tasks = [];
let currentId = 1;

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = ({ titulo, completada = false }) => {
  const nuevaTarea = {
    id: currentId++,
    titulo,
    completada,
  };

  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new Error('NOT_FOUND');
  }

  tasks.splice(index, 1);
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
};