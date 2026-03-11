# Prompt Engineering aplicado al desarrollo
En este documento se recogen distintos tipos de prompts útiles para obtener mejores respuestas de herramientas de IA durante el desarrollo de TaskFlow. Se muestran ejemplos de role prompting, few-shot prompting, razonamiento paso a paso y prompts con restricciones, explicando para qué sirve cada uno y por qué funciona bien.

## 1. Role prompting 
Prompts donde se define un rol específico para la IA.

### Prompt 1 - Revisión de código

#### Prompt

Actúa como un desarrollador senior de JavaScript. Analiza la siguiente función y sugiere una versión optimizada siguiendo buenas prácticas de JavaScript moderno. Explica brevemente qué mejoras has realizado y por qué.

*CÓDIGO*

#### Para qué sirve
Para revisar funciones existentes y detectar mejoras de legibilidad, buenas prácticas y posibles optimizaciones.

#### Por qué funciona
Definir el rol de desarrollador senior orienta a la IA a ofrecer soluciones más estructuradas y basadas en experiencia profesional.

### Prompt 2 - Detección de bugs

#### Prompt

Actúa como un desarrollador senior especializado en debugging. Analiza el siguiente código JavaScript, identifica posibles errores o problemas potenciales y explica cómo solucionarlos.

*CÓDIGO*

#### Para qué sirve
Ayuda a detectar bugs o comportamientos inesperados en código JavaScript.

#### Por qué funciona
El rol especializado dirige la respuesta hacia análisis técnico profundo en lugar de explicaciones superficiales.

### Prompt 3 - Arquitectura frontend

#### Prompt

Actúa como un arquitecto frontend con experiencia en aplicaciones JavaScript. Analiza la estructura de este proyecto y sugiere mejoras en organización de archivos, nombres de funciones y modularización.

*CÓDIGO*

#### Para qué sirve
Para mejorar la estructura de proyectos y aplicar buenas prácticas de arquitectura frontend.

#### Por qué funciona
El rol de arquitecto hace que la IA piense en estructura, escalabilidad y mantenimiento del código.


## 2. Few-shot prompting 
Prompts donde se incluyen ejemplos para guiar la respuesta.

### Prompt 4 - Generar función con ejemplo

#### Prompt
Crea una función JavaScript siguiendo este ejemplo.

function sum(a, b) {
  return a + b;
}

Ahora crea una función llamada multiply que multiplique dos números siguiendo el mismo estilo.

#### Para qué sirve
Permite guiar a la IA usando ejemplos concretos de estilo y estructura.

#### Por qué funciona
Los ejemplos ayudan al modelo a entender exactamente el formato y estilo de código esperado.

### Prompt 5 - Formateo de fechas

#### Prompt
Sigue este ejemplo para crear una función similar.

function formatName(name) {
  return name.trim().toLowerCase();
}

Ahora crea una función llamada formatDate que reciba una fecha y la convierta a formato YYYY-MM-DD.

#### Para qué sirve
Para generar funciones siguiendo patrones existentes en el proyecto.

#### Por qué funciona
El ejemplo establece claramente el estilo y patrón de implementación.

### Prompt 6 - Validación de datos

#### Prompt
Basándote en este ejemplo:

function isEmail(value) {
  return value.includes("@");
}

Crea una función isPasswordValid que compruebe si una contraseña tiene al menos 8 caracteres.

#### Para qué sirve
Ayuda a generar funciones similares manteniendo coherencia en el código.

#### Por qué funciona
Los ejemplos reducen la ambigüedad y mejoran la precisión de la respuesta.


## 3. Chain of thought 
Prompts donde se pide razonamiento paso a paso.

### Prompt 7 - Optimización paso a paso

#### Prompt
Analiza la siguiente función JavaScript y explica paso a paso cómo podrías mejorar su rendimiento y legibilidad. Después muestra la versión optimizada.

*CÓDIGO*

#### Para qué sirve
Permite entender el proceso de mejora del código.

#### Por qué funciona
Pedir razonamiento paso a paso hace que la IA explique su proceso de análisis.

### Prompt 8 - Depuración paso a paso

#### Prompt
El siguiente código tiene un bug. Analízalo paso a paso, explica dónde está el problema y muestra cómo corregirlo.

*CÓDIGO*

#### Para qué sirve
Para entender errores complejos en el código.

#### Por qué funciona
La explicación paso a paso facilita comprender el origen del bug.


## 4. Restricciones en la respuesta 
Prompts donde se limita el formato o comportamiento de la respuesta.

### Prompt 9 - Código corto

#### Prompt
Genera una función JavaScript que elimine elementos duplicados de un array. La función debe tener máximo 10 líneas de código.

#### Para qué sirve
Para obtener soluciones concisas y fáciles de integrar.

#### Por qué funciona
Las restricciones obligan a la IA a producir respuestas más directas.

### Prompt 10 - Explicación breve

#### Prompt
Explica qué es el Event Loop en JavaScript en menos de 100 palabras y usando un lenguaje sencillo.

#### Para qué sirve
Para obtener explicaciones rápidas de conceptos técnicos.

#### Por qué funciona
Limitar la longitud evita respuestas excesivamente largas.
