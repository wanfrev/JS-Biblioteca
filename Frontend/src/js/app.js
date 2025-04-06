export async function fetchTesis() {
  try {
    const response = await fetch("http://localhost:5000/api/upload"); // Cambia la URL si es necesario
    if (!response.ok) {
      throw new Error("Error al obtener las tesis");
    }
    const tesis = await response.json();
    return tesis;
  } catch (error) {
    console.error("Error al obtener las tesis:", error);
    return [];
  }
}

export async function displayTesis(filter = {}) {
  const tesisContainer = document.getElementById("thesis-list");
  if (!tesisContainer) return;

  tesisContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar

  const tesis = await fetchTesis(); // Obtener las tesis desde el backend
  console.log("Tesis obtenidas:", tesis); // Depuración

  const filteredTesis = tesis.filter(
    (t) =>
      (!filter.career || t.carrera === filter.career) &&
      (!filter.author || t.autor === filter.author) &&
      (!filter.date || t.fecha_pub === filter.date)
  );

  filteredTesis.forEach((t) => {
    const fechaFormateada = new Date(t.fecha_pub).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tesisElement = document.createElement("div");
    tesisElement.className = "thesis";
    tesisElement.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>Autor: ${t.autor || "Desconocido"}</p>
      <a href="http://localhost:5000/upload/${t.documento}" target="_blank">Ver PDF</a>
    `;

    // Agregar evento para mostrar detalles al hacer clic
    tesisElement.addEventListener("click", () => {
      displayThesisDetails(t);
    });

    tesisContainer.appendChild(tesisElement);
  });
}

function displayThesisDetails(tesis) {
  const detailsContainer = document.getElementById("thesis-details");
  if (!detailsContainer) return;

  const fechaFormateada = new Date(tesis.fecha_pub).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  detailsContainer.innerHTML = `
    <h3>${tesis.titulo}</h3>
    <p><strong>Autor:</strong> ${tesis.autor || "Desconocido"}</p>
    <p><strong>Carrera:</strong> ${tesis.carrera || "Sin carrera"}</p>
    <p><strong>Fecha de Publicación:</strong> ${fechaFormateada}</p>
    <p><strong>Descripción:</strong> ${tesis.des_tesis}</p>
    <a href="http://localhost:5000/upload/${tesis.documento}" target="_blank">Ver PDF</a>
  `;
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
  // Filtrar las tesis por título que contenga el texto ingresado
  fetchTesis().then((tesis) => {
    const filteredTesis = tesis.filter((t) =>
      t.titulo.toLowerCase().includes(query) // Convertir a minúsculas para comparación
    );
    displayFilteredTesis(filteredTesis);
  });
}

export function displayFilteredTesis(filteredTesis) {
  const tesisContainer = document.getElementById("thesis-list");
  if (!tesisContainer) return;

  tesisContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar

  filteredTesis.forEach((t) => {
    const fechaFormateada = new Date(t.fecha_pub).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tesisElement = document.createElement("div");
    tesisElement.className = "thesis";
    tesisElement.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>Autor: ${t.autor || "Desconocido"}</p>
      <p>Carrera: ${t.carrera || "Sin carrera"}</p>
      <p>Fecha: ${fechaFormateada}</p>
      <a href="http://localhost:5000/upload/${t.documento}" target="_blank">Ver PDF</a>
    `;
    tesisContainer.appendChild(tesisElement);
  });
}

export function filterTesis(career, author, date) {
  const filter = { career, author, date };
  displayTesis(filter);
}

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar las tesis al cargar la página
  displayTesis();

  // Manejar el evento de búsqueda
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas
      searchTesis(query);
    });
  }

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