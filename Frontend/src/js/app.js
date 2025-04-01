const tesis = [
  {
    id: 1,
    title: "Tesis de Ejemplo 1",
    author: "Autor 1",
    career: "Ingeniería",
    date: "2023-01-01",
    pdf: "assets/tesis/example.pdf",
  },
  {
    id: 2,
    title: "Tesis de Ejemplo 2",
    author: "Autor 2",
    career: "Medicina",
    date: "2023-02-01",
    pdf: "assets/tesis/example.pdf",
  },
];

export function displayTesis(filter = {}) {
  const tesisContainer = document.getElementById("thesis-list");
  if (!tesisContainer) return;

  tesisContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar

  const filteredTesis = tesis.filter(
    (t) =>
      (!filter.career || t.career === filter.career) &&
      (!filter.author || t.author === filter.author) &&
      (!filter.date || t.date === filter.date)
  );

  filteredTesis.forEach((t) => {
    const tesisElement = document.createElement("div");
    tesisElement.className = "thesis";
    tesisElement.innerHTML = `
      <h3>${t.title}</h3>
      <p>Autor: ${t.author}</p>
      <p>Carrera: ${t.career}</p>
      <p>Fecha: ${t.date}</p>
      <a href="${t.pdf}" target="_blank">Ver PDF</a>
    `;
    tesisContainer.appendChild(tesisElement);
  });
}

export function addTesis(newTesis) {
  // Agregar la nueva tesis al array
  tesis.push(newTesis);

  // Actualizar la vista
  displayTesis();
}

export function deleteTesis(id) {
  if (localStorage.getItem("userType") === "admin") {
    const index = tesis.findIndex((t) => t.id === id);
    if (index !== -1) {
      tesis.splice(index, 1);
      displayTesis();
    }
  } else {
    alert("Solo el administrador puede eliminar tesis.");
  }
}

export function searchTesis(query) {
  const filter = { title: query };
  displayTesis(filter);
}

export function filterTesis(career, author, date) {
  const filter = { career, author, date };
  displayTesis(filter);
}

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar las tesis al cargar la página
  displayTesis();

  // Manejar el evento del botón "Agregar Tesis"
  const addThesisBtn = document.getElementById("add-thesis-btn");
  if (addThesisBtn) {
    addThesisBtn.addEventListener("click", () => {
      const newTesis = {
        id: tesis.length + 1, // Generar un ID único
        title: `Tesis de Ejemplo ${tesis.length + 1}`,
        author: `Autor ${tesis.length + 1}`,
        career: "Carrera Ejemplo",
        date: new Date().toISOString().split("T")[0], // Fecha actual
        pdf: "assets/tesis/example.pdf",
      };

      addTesis(newTesis); // Usar la función para agregar la nueva tesis
    });
  }
});