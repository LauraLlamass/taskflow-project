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


### Solución sin IA
````javascript

````

### Solución con IA
````javascript

````

### Comparación

#### Calidad del código

#### Tiempo

#### Comprensión

## Experimento 2

### Problema

### Solución sin IA
````javascript

````

### Solución con IA
````javascript

````

### Comparación

#### Calidad del código

#### Tiempo

#### Comprensión

## Experimento X - 

### Problema

### Solución sin IA
````javascript

````

### Solución con IA
````javascript

````

### Comparación

#### Calidad del código

#### Tiempo

#### Comprensión
