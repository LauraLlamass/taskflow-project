document.addEventListener("DOMContentLoaded", () => {
  console.log("JS cargado");

  const form = document.querySelector("#idea-form");
  const input = document.querySelector("#idea-input");
  const list = document.querySelector("#idea-list");
  const search = document.querySelector("#idea-search");
  const ideasProfes = [
    "Un pueblo donde nadie puede mentir",
    "Una biblioteca que reescribe finales",
    "Una escritora que cae dentro de su historia y sus personajes le recriminan",
  ];
  const toggleBtn = document.querySelector("#theme-toggle");
  const root = document.documentElement; 

  /*Preferncia guardada*/
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    root.classList.add("dark");
    toggleBtn.textContent = "☀️";
  } else {
    root.classList.remove("dark");
    toggleBtn.textContent = "🌙";
  }

  /*Alternancia estilo*/
  toggleBtn.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });

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
    li.className = "bg-white p-4 rounded-xl border border-black/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition";
    if (fija) li.classList.add("idea-profesor");

    if (fija) {
      const badge = document.createElement("span");
      badge.textContent = "Profesoras";
      badge.className = "inline-block self-start text-xs px-3 py-1 rounded-full bg-[#B76E79] text-white mb-2";
      li.appendChild(badge);
    }

    const span = document.createElement("span");
    span.textContent = texto;
    span.classList.add("text-[#2E1F27]");
    li.appendChild(span);

    if (!fija) {
      const button = document.createElement("button");
      button.textContent = "🗑️";
      button.className = "self-end p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-[#B76E79]/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79]";

      button.addEventListener("click", () => {

        li.classList.add("borrando");

        setTimeout(() => {
          ideas = ideas.filter((idea) => idea !== texto);
          guardarIdeas();
          li.remove();
        }, 250);

      });

      li.appendChild(button);
    }

    //orden: profes arriba, usuarios justo debajo (nuevos primero)
    if (fija) {
      list.appendChild(li);
    } else {
      const primeraUsuario = list.querySelector("li:not(.idea-profesor)");
      if (primeraUsuario) list.insertBefore(li, primeraUsuario);
      else list.appendChild(li);
    }
  }

  // iniciar lista
  list.innerHTML = "";
  ideasProfes.forEach((idea) => pintarIdeaEnDOM(idea, true));

  cargarIdeas();
  for (let i = ideas.length - 1; i >= 0; i--) {
    pintarIdeaEnDOM(ideas[i], false);
  }

  // Submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const texto = input.value.trim();
    if (texto === "") return;

    ideas.unshift(texto);
    guardarIdeas();
    pintarIdeaEnDOM(texto, false);

    input.value = "";
    input.focus();
  });

  // Buscador 
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



  menuCurso.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const seccion = btn.dataset.seccion;
    panelTitulo.textContent = contenido[seccion].titulo;
    panelTexto.textContent = contenido[seccion].texto;

    // marcar activo
    menuCurso.querySelectorAll("button").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
  });
});