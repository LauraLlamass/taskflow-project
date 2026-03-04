document.addEventListener("DOMContentLoaded", () => {
  console.log("JS cargado");

  const form = document.querySelector("#idea-form");
  const input = document.querySelector("#idea-input");
  const list = document.querySelector("#idea-list");
  const search = document.querySelector("#idea-search"); // puede ser null si no existe

  const ideasProfes = [
    "Un pueblo donde nadie puede mentir",
    "Una biblioteca que reescribe finales",
    "Un villano que cree ser el héroe",
    "Una escritora que cae dentro de su historia y sus personajes le recriminan",
  ];

  let ideas = [];

  function guardarIdeas() {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }

  function cargarIdeas() {
    const data = localStorage.getItem("ideas");
    ideas = data ? JSON.parse(data) : [];
  }

  function pintarIdeaEnDOM(texto, fija = false) {
    const li = document.createElement("li");
    if (fija) li.classList.add("idea-profesor");

    if (fija) {
      const badge = document.createElement("span");
      badge.textContent = "Profesoras";
      badge.classList.add("badge-profe");
      li.appendChild(badge);
    }

    const span = document.createElement("span");
    span.textContent = texto;
    li.appendChild(span);

    if (!fija) {
      const button = document.createElement("button");
      button.textContent = "🗑️";

      button.addEventListener("click", () => {
        ideas = ideas.filter((idea) => idea !== texto);
        guardarIdeas();
        li.remove();
      });

      li.appendChild(button);
    }

    // Orden: profes arriba, usuarios justo debajo (nuevos primero)
    if (fija) {
      list.appendChild(li);
    } else {
      const primeraUsuario = list.querySelector("li:not(.idea-profesor)");
      if (primeraUsuario) list.insertBefore(li, primeraUsuario);
      else list.appendChild(li);
    }
  } // <-- ESTA llave te faltaba

  // Al iniciar
  list.innerHTML = "";
  ideasProfes.forEach((idea) => pintarIdeaEnDOM(idea, true));

  cargarIdeas();
  ideas.forEach((idea) => pintarIdeaEnDOM(idea, false));

  // Submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const texto = input.value.trim();
    if (texto === "") return;

    ideas.unshift(texto); // así las nuevas quedan las primeras del usuario también en memoria
    guardarIdeas();
    pintarIdeaEnDOM(texto, false);

    input.value = "";
    input.focus();
  });

  // Buscador (si existe)
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.toLowerCase();
      const items = list.querySelectorAll("li");

      items.forEach((li) => {
        const texto = li.innerText.toLowerCase();
        li.style.display = texto.includes(q) ? "" : "none";
      });
    });
  }
});