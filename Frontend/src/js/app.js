export async function fetchTesis() {
  try {
    const response = await fetch("http://localhost:5000/api/upload");
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

  tesisContainer.innerHTML = "";

  const tesis = await fetchTesis();
  console.log("Tesis obtenidas:", tesis);

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
      <a href="http://localhost:5000/api/upload/documento/${t.id_tesis}" target="_blank">Ver PDF</a>
    `;

    tesisElement.addEventListener("click", () => {
      displayThesisDetails(t);
    });

    tesisContainer.appendChild(tesisElement);
  });
}

export function searchTesis(query) {
  console.log("Texto de búsqueda:", query); // Depuración
  fetchTesis().then((tesis) => {
    const filteredTesis = tesis.filter((t) =>
      t.titulo.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Tesis filtradas:", filteredTesis); // Depuración
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
      <a href="http://localhost:5000/api/upload/documento/${t.id_tesis}" target="_blank">Ver PDF</a>
    `;

    tesisElement.addEventListener("click", () => {
      displayThesisDetails(t);
    });

    tesisContainer.appendChild(tesisElement);
  });
}

function displayThesisDetails(tesis) {
  const detailsContainer = document.getElementById("thesis-details");
  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");

  if (!detailsContainer || !editButton || !deleteButton) return;

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

  // Mostrar el botón de "Editar"
  editButton.style.display = "block";
  editButton.onclick = () => {
    const queryParams = new URLSearchParams({
      id: tesis.id_tesis,
      titulo: tesis.titulo,
      autor: tesis.autor,
      carrera: tesis.carrera,
      fecha_pub: tesis.fecha_pub,
      descripcion: tesis.des_tesis,
    });

    window.location.href = `upload-form.html?${queryParams.toString()}`;
  };

  // Mostrar el botón de "Eliminar"
  deleteButton.style.display = "block";
  deleteButton.onclick = async () => {
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la tesis "${tesis.titulo}"?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/upload/${tesis.id_tesis}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Tesis eliminada exitosamente.");
          displayTesis(); // Actualizar la lista de tesis
        } else {
          alert("Error al eliminar la tesis.");
        }
      } catch (error) {
        console.error("Error al eliminar la tesis:", error);
        alert("Error al eliminar la tesis.");
      }
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  displayTesis();

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value;
      searchTesis(query);
    });
  }
});