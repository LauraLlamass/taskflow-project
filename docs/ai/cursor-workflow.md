# Cursor workflow

## Introduction
En este documento se describe el primer contacto con Cursor y cómo se utilizó durante el desarrollo del proyecto TaskFlow. El objetivo fue explorar las herramientas de asistencia con inteligencia artificial que ofrece Cursor para generar, modificar y comprender código dentro del proyecto.

## Installation and project setup
Se instaló Cursor y posteriormente se abrió el proyecto TaskFlow utilizando la opción **File → Open Folder**. Una vez abierto el proyecto, se pudo acceder a todos los archivos del mismo desde el explorador del editor.

La interfaz de Cursor es muy similar a Visual Studio Code. Desde el inicio fue posible navegar entre archivos, editar código y utilizar las herramientas de asistencia de IA integradas.

## Exploring the interface
Se exploraron las principales herramientas de la interfaz de Cursor:

- **Explorador de archivos** para navegar entre los archivos del proyecto.
- **Terminal integrada** para ejecutar comandos desde el propio editor.
- **Chat de IA** para hacer preguntas sobre el código.
- **Autocompletado inteligente** que sugiere código automáticamente.

Estas herramientas permiten trabajar de forma más eficiente y entender mejor el código existente.

## Autocomplete with comments
Para probar el autocompletado se escribió un comentario describiendo una función en lenguaje natural:

//Crea una función que cuente cuantas ideas estan almacenadas actualmente. 

A partir de este comentario, Cursor generó automáticamente una función que intentaba contar las ideas almacenadas en `localStorage`. La sugerencia tenía sentido dentro del contexto del proyecto, ya que la aplicación utiliza `localStorage` para guardar las ideas del usuario.

Esto demuestra que Cursor es capaz de interpretar comentarios escritos en lenguaje natural y generar código relacionado con el proyecto.

## Contextual chat
También se utilizó el chat contextual para pedir explicaciones sobre partes del código. Para ello se seleccionó una función existente y se solicitó una explicación de su funcionamiento.

Cursor explicó correctamente que la función utilizaba `localStorage` para guardar el array de ideas, convirtiéndolo previamente a formato JSON mediante `JSON.stringify()`. E

## Inline editing
Se probó la edición inline solicitando a Cursor que mejorara una función existente y añadiera comentarios explicativos. Cursor modificó el código generando una versión ligeramente mejorada de la función y añadiendo un comentario que explicaba su propósito.

## Composer
Se utilizó la herramienta Composer para generar cambios más complejos en el proyecto. En este caso se solicitó la creación de una función que eliminara todas las ideas almacenadas en `localStorage`.

Cursor generó automáticamente la función correspondiente y además sugirió añadir un botón en la interfaz para ejecutar esta acción. También propuso incluir un mensaje de confirmación para evitar que el usuario elimine las ideas accidentalmente.

Durante la prueba fue necesario ajustar manualmente algunas partes del código generado, ya que Cursor modificó algunas secciones que ya funcionaban correctamente. Esto demuestra que, aunque la IA puede ser muy útil, siempre es importante revisar el código generado.

## Keyboard shortcuts
Durante el uso de Cursor se identificaron algunos atajos de teclado útiles:

- `Ctrl + K` → abrir la edición asistida con IA  
- `Ctrl + L` → abrir el chat de Cursor  
- `Ctrl + \` → abrir la terminal integrada  

Estos atajos permiten trabajar de forma más rápida dentro del editor.

## Conclusion

Cursor es una herramienta útil para acelerar el desarrollo y mejorar la productividad. Sus funciones de autocompletado, chat contextual y generación de código permiten comprender y modificar proyectos de forma más rápida.

Sin embargo, en algunos casos es necesario revisar y ajustar manualmente el código generado por la IA, ya que puede introducir cambios que no siempre se ajustan exactamente a las necesidades del proyecto.


# Experimento con MCP

Para comprender cómo podría utilizarse MCP durante el desarrollo, se realizaron varias consultas utilizando el contexto del proyecto.

El objetivo era comprobar si el asistente de IA podía analizar la estructura de la aplicación y explicar cómo funcionan distintas partes del código.

## Consultas realizadas

Se hicieron preguntas como:

- Explica la estructura de este proyecto.
- ¿Dónde se almacenan las tareas en esta aplicación?
- ¿Cómo funciona la barra de progreso?
- Encuentra la función que actualiza las estadísticas.
- Explica cómo se utiliza localStorage en esta aplicación.

## Observaciones

El asistente de IA fue capaz de analizar los archivos del proyecto y proporcionar explicaciones basadas en el código existente.

Identificó correctamente varias partes clave de la aplicación, como:

- la estructura de las tareas utilizada en la aplicación
- cómo se guardan las tareas en localStorage
- las funciones responsables de renderizar las tareas en el DOM
- la lógica utilizada para actualizar las estadísticas y la barra de progreso

Esto demuestra cómo el acceso al proyecto mediante MCP permite que la IA proporcione ayuda contextual durante el desarrollo.

## Conclusión

El uso de servidores MCP puede mejorar significativamente la utilidad de las herramientas de IA en entornos de desarrollo. Al poder acceder a archivos del proyecto y otras herramientas externas, el asistente puede comprender mejor el código y ofrecer explicaciones, ayuda para depuración y sugerencias de implementación más precisas.