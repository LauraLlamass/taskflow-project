# Experimentos con IA en programación
En este documento se comparan distintas tareas de programación realizadas primero sin asistencia de IA y posteriormente con ayuda de IA. El objetivo es analizar el impacto en tiempo de desarrollo, calidad del código y comprensión del problema.


## Experimento 1 - Contar palabras en un texto

### Problema
Crear una función en JavaScript que cuente cuántas veces aparece cada palabra en un texto.

### Solución sin IA
````javascript
function contarFrecuenciaPalabras(texto) {
  const textoLimpio = texto.toLowerCase().replace(/[.,!?;:]/g, "");

  const palabras = textoLimpio.split(/\s+/);

  const frecuencia = {};

  palabras.forEach(palabra => {
    if (palabra) { 
      frecuencia[palabra] = (frecuencia[palabra] || 0) + 1;
    }
  });

  return frecuencia;
}
````

### Solución con IA
````javascript
function contarPalabras(texto) {
  // Convertir a minúsculas y eliminar signos de puntuación
  const palabras = texto
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

  const conteo = {};

  for (const palabra of palabras) {
    if (palabra === "") continue;

    if (conteo[palabra]) {
      conteo[palabra]++;
    } else {
      conteo[palabra] = 1;
    }
  }

  return conteo;
}
// Ejemplo de uso
const texto = "Hola mundo hola JavaScript mundo mundo";
const resultado = contarPalabras(texto);

console.log(resultado);
````
### Comparación

#### Calidad del código
Mi solución limpia el texto y cuenta la frecuencia de palabras utilizando un objeto. La solución generada por la IA es similar, aunque utiliza una expresión regular más general para eliminar caracteres que no son letras o espacios.

#### Tiempo
Sin IA tardé aproximadamente 10-12 minutos en pensar la solución y escribir el código. Con IA obtuve una solución funcional en menos de 2 minutos.

#### Comprensión
Resolver el problema sin IA me ayudó a entender mejor cómo dividir el texto en palabras y cómo contar frecuencias usando un objeto en JavaScript. La solución de la IA mostró formas alternativas de limpiar el texto.


## Experimento 2 - Capitalizar palabras

### Problema
Crear una función que convierta la primera letra de cada palabra de una frase en mayúscula.

### Solución sin IA
````javascript
const frase = "hola mundo desde javascript";
const fraseCapitalizada = frase.replace(/\b\w/g, l => l.toUpperCase());
console.log(fraseCapitalizada);
```` 
### Solución con IA
````javascript
function capitalizarFrase(frase) {
  return frase
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}
````

### Comparación
#### Calidad del código
Ambas soluciones funcionan correctamente, pero utilizan enfoques diferentes. Mi solución utiliza una expresión regular para encontrar la primera letra de cada palabra, mientras que la solución de la IA divide la frase en palabras, transforma cada una y luego las vuelve a unir.

#### Tiempo
Resolver el problema sin IA me llevó aproximadamente 4 minutos. Con ayuda de IA obtuve una solución en aproximadamente 1 minuto.
#### Comprensión
La solución sin IA me obligó a pensar en cómo funcionan las expresiones regulares para detectar el inicio de cada palabra. La solución de la IA es más explícita y fácil de entender para alguien que está empezando con JavaScript.

## Experimento 3 - Filtrar números pares

### Problema
Crear una función que reciba un array de números y devuelva solo los números pares.

### Solución sin IA
````javascript
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pares = numeros.filter(num => num % 2 === 0);

console.log(pares);
````

### Solución con IA
````javascript
function obtenerPares(numeros) {
  return numeros.filter(num => num % 2 === 0);
}

const array = [1, 2, 3, 4, 5, 6, 7, 8];

const pares = obtenerPares(array);

console.log(pares);
````

### Comparación

#### Calidad del código
Ambas soluciones utilizan el método filter(). La diferencia principal es que la solución generada por la IA encapsula la lógica dentro de una función reutilizable, mientras que mi solución aplica el filtro directamente sobre el array.

#### Tiempo
Resolver el problema sin IA me llevó aproximadamente 4 minutos. Con ayuda de IA obtuve una solución funcional en unos 30 segundos.

#### Comprensión
Resolver el problema sin IA me ayudó a entender cómo utilizar filter() para seleccionar elementos de un array en JavaScript. La solución de la IA muestra una forma más estructurada de organizar el código mediante funciones reutilizables.


# Experimentos con tareas relacionadas con TaskFlow

## Experimento 1

### Problema
Actúa como un desarrollador JavaScript senior.

Tengo esta función de validación para un gestor de tareas. 
Comprueba que el título no esté vacío y que no esté duplicado.

Quiero que la refactorices para mejorar:

- legibilidad
- claridad de la lógica
- validación del texto (por ejemplo espacios vacíos)
- buenas prácticas de JavaScript

Mantén la misma funcionalidad y explica brevemente los cambios.


### Solución sin IA
````javascript
function validateTask(title) {
    if (title === "") return false;
    return !tasks.some((task) => task.title.toLowerCase() === title.toLowerCase());
  }
````

### Solución con IA
````javascript
function validateTask(title) {
  // Validate input type
  if (typeof title !== "string") {
    return false;
  }

  // Remove leading/trailing spaces
  const normalizedTitle = title.trim();

  // Check empty title after trimming
  if (!normalizedTitle) {
    return false;
  }

  // Normalize for comparison
  const lowerTitle = normalizedTitle.toLowerCase();

  // Check if a task with the same title already exists
  const isDuplicate = tasks.some(
    (task) => task.title.trim().toLowerCase() === lowerTitle
  );

  return !isDuplicate;
}
````

### Comparación

#### Calidad del código
La versión sin IA es más corta y compacta.  
Sin embargo, la versión generada por la IA separa la lógica en varios pasos utilizando variables intermedias, lo que mejora la legibilidad del código.  
Además, la validación es más robusta porque comprueba el tipo del dato, elimina espacios innecesarios y normaliza el texto antes de compararlo.

#### Tiempo
Resolver el problema sin IA me llevó aproximadamente 12 minutos, ya que tuve que analizar la función original y pensar cómo mejorarla.  
Con ayuda de la IA obtuve una solución funcional en aproximadamente un minuto. Después tardé unos minutos más en revisar el código y comprobar que funcionaba correctamente dentro del proyecto.

#### Comprensión
Para este experimento utilicé un prompt en el que definía el rol de la IA como desarrollador JavaScript senior y pedía mejorar la legibilidad y la validación manteniendo la funcionalidad original.  

Resolver el problema sin IA me ayudó a entender mejor la lógica del código y a pensar más en cómo funciona la validación dentro del proyecto.  
La solución de la IA muestra una forma más estructurada y robusta de escribir el código, pero al generar la solución directamente he aprendido menos sobre el proceso de desarrollo.

## Experimento 2

### Problema
Actúa como un desarrollador JavaScript senior.

Tengo una función que renderiza tareas en una aplicación de gestión de tareas. 
La función filtra tareas por texto de búsqueda y también por estado (all, pending, completed).

Quiero que refactorices la función para mejorar:

- legibilidad
- separación de responsabilidades
- claridad del código

Mantén exactamente la misma funcionalidad.


### Solución sin IA
````javascript
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
````

### Solución con IA
````javascript
function matchesQuery(task, query) {
  return task.title.toLowerCase().includes(query);
}

function matchesStatusFilter(task, filter) {
  if (filter === "pending") return !task.completed;
  if (filter === "completed") return task.completed;
  return true; // "all"
}

function getFilteredTasks(query = "") {
  return tasks
    .filter((task) => matchesQuery(task, query))
    .filter((task) => matchesStatusFilter(task, currentFilter));
}

function renderTasks(query = "") {
  list.innerHTML = "";

  const filteredTasks = getFilteredTasks(query);

  filteredTasks.forEach((task) => renderTaskInDOM(task));
}
````

### Comparación

#### Calidad del código
La IA separó la lógica en distintas funciones, mientras que antes todo estaba dentro de una sola. Esto mejora la legibilidad del código y facilita su mantenimiento, ya que cada función tiene ahora una responsabilidad más clara.

#### Tiempo
Resolver el problema sin IA me llevó aproximadamente 17 minutos, ya que tuve que analizar la función original y pensar cómo reorganizar la lógica del filtrado.  
Con ayuda de la IA obtuve una solución funcional en aproximadamente un minuto. Después tardé unos minutos más en revisar el código y comprobar que funcionaba correctamente dentro del proyecto.

#### Comprensión
Cuando yo realicé el fragmento de código entendí mejor la lógica del filtrado y cómo funcionaban las condiciones dentro de la función. Sin embargo, al ver la solución propuesta por la IA entendí de mejor forma cómo organizar el código en varias funciones para conseguir una arquitectura más clara y fácil de mantener.

## Experimento 3 

### Problema
Actúa como un desarrollador JavaScript senior.

Tengo una función de una aplicación de tareas que actualiza estadísticas y la barra de progreso. Actualmente esta función calcula datos y también actualiza elementos del DOM.

Quiero que la refactorices para mejorar:

- legibilidad
- separación de responsabilidades
- claridad del código
- mantenimiento

Mantén exactamente la misma funcionalidad y explica brevemente los cambios realizados.

### Solución sin IA
````javascript
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
````

### Solución con IA
````javascript
function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  return {
    total,
    completed,
    pending,
    percentage,
  };
}

function renderTaskStats({ total, completed, pending }) {
  totalEl.textContent = total;
  completedEl.textContent = completed;
  pendingEl.textContent = pending;
}

function renderProgressText({ total, completed }) {
  if (!progressText) return;

  progressText.textContent = `${completed} / ${total} tareas completadas`;
}

function renderProgressBar({ percentage }) {
  if (!progressBar) return;

  progressBar.style.width = `${percentage}%`;

  const isComplete = percentage === 100;

  progressBar.classList.toggle("bg-green-500", isComplete);
  progressBar.classList.toggle("bg-[#B76E79]", !isComplete);
}

function updateStats() {
  const stats = getTaskStats(tasks);

  renderTaskStats(stats);
  renderProgressText(stats);
  renderProgressBar(stats);
}
````

### Comparación
#### Calidad del código
La versión generada por la IA mejora bastante la calidad del código porque separa la lógica en varias funciones pequeñas y con responsabilidades claras. Antes, `updateStats()` calculaba estadísticas y además modificaba distintos elementos del DOM dentro de la misma función. Con la refactorización, el código queda más legible, más ordenado y más fácil de mantener.

#### Tiempo
Resolver este problema sin IA me llevó más tiempo porque tuve que pensar cómo dividir la función sin romper su funcionamiento. Con ayuda de la IA obtuve una propuesta funcional en muy poco tiempo. Aun así, tuve que revisar el código para asegurarme de que seguía funcionando correctamente dentro del proyecto.

#### Comprensión
Al hacerlo sin IA entendí mejor cómo se calculaban las estadísticas y cómo se actualizaban los elementos visuales. La solución de la IA me ayudó a ver con más claridad cómo dividir una función grande en varias más pequeñas, consiguiendo una estructura más limpia. En este caso, la IA me ayudó no solo a ahorrar tiempo, sino también a entender mejor cómo organizar el código.