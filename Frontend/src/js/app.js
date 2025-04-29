export async function fetchTesis(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5000/api/upload?${queryParams}`);
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

  const tesis = await fetchTesis(filter);
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
      <a href="http://localhost:5000/upload/${t.documento}" target="_blank">Ver PDF</a>
    `;

    tesisElement.addEventListener("click", () => {
      displayThesisDetails(t);
    });

    tesisContainer.appendChild(tesisElement);
  });
}

export function searchTesis(query) {
  console.log("Texto de búsqueda:", query); // Depuración

  fetchTesis({ query }).then((tesis) => {
    console.log("Tesis filtradas:", tesis); // Depuración
    displayFilteredTesis(tesis);
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
      <a href="http://localhost:5000/upload/${t.documento}" target="_blank">Ver PDF</a>
    `;

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

  // Detectar si estamos en home-admin.html
  const currentPage = getCurrentPage();
  if (currentPage === "home-admin.html") {
    const editButton = document.getElementById("edit-button");
    const deleteButton = document.getElementById("delete-button");

    if (editButton && deleteButton) {
      // Mostrar y configurar el botón de "Editar"
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

      // Mostrar y configurar el botón de "Eliminar"
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
  }
}

function getCurrentPage() {
  const path = window.location.pathname; // Obtiene la ruta actual
  const page = path.split("/").pop(); // Obtiene el nombre del archivo (por ejemplo, "home-guest.html")
  return page;
}

export async function loadCarreras() {
  const carreraSelect = document.getElementById("filter-carrera");

  try {
    const response = await fetch("http://localhost:5000/api/carreras");
    if (!response.ok) {
      throw new Error("Error al obtener las carreras");
    }

    const carreras = await response.json();

    // Limpiar las opciones existentes
    carreraSelect.innerHTML = '<option value="">Carrera</option>';

    // Agregar las opciones dinámicas
    carreras.forEach((carrera) => {
      const option = document.createElement("option");
      option.value = carrera.car_nom; // Usar el nombre de la carrera como valor
      option.textContent = carrera.car_nom; // Mostrar el nombre de la carrera
      carreraSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener las carreras:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayTesis();

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.trim();
      searchTesis(query);
    });
  }

  document.getElementById("filters-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const carrera = document.getElementById("filter-carrera").value;
    const autor = document.getElementById("filter-autor").value;
    const fecha = document.getElementById("filter-fecha").value;
    const orden = document.getElementById("filter-orden").value;

    displayTesis({ carrera, autor, fecha, orden });
  });

  loadCarreras();

  const restoreButton = document.getElementById("restore-button");
  const modal = document.getElementById("restore-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeModalButton = document.getElementById("close-modal");
  const deletedThesisList = document.getElementById("deleted-thesis-list");

  // Abrir el modal y mostrar el overlay
  restoreButton.addEventListener("click", async () => {
    console.log("Botón 'Restaurar Tesis' clickeado");

    try {
      // Llamar a la API para obtener las tesis eliminadas
      const response = await fetch("http://localhost:5000/api/upload/eliminadas");
      if (!response.ok) {
        throw new Error("Error al obtener las tesis eliminadas");
      }

      const tesisEliminadas = await response.json();
      console.log("Tesis eliminadas obtenidas:", tesisEliminadas);

      // Limpiar la lista antes de agregar nuevos elementos
      deletedThesisList.innerHTML = "";

      // Agregar las tesis eliminadas al modal
      tesisEliminadas.forEach((tesis) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${tesis.titulo} - ${tesis.fecha_pub}`;
        
        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restaurar";
        restoreButton.style.marginLeft = "10px";
        restoreButton.addEventListener("click", async () => {
          try {
            const restoreResponse = await fetch(
              `http://localhost:5000/api/upload/restaurar/${tesis.id_tesis}`,
              { method: "POST" }
            );
            if (restoreResponse.ok) {
              alert("Tesis restaurada exitosamente");
              listItem.remove(); // Eliminar la tesis restaurada de la lista
            } else {
              alert("Error al restaurar la tesis");
            }
          } catch (error) {
            console.error("Error al restaurar la tesis:", error);
          }
        });

        listItem.appendChild(restoreButton);
        deletedThesisList.appendChild(listItem);
      });

      // Mostrar el modal y el overlay
      modal.style.display = "block";
      overlay.style.display = "block";
    } catch (error) {
      console.error("Error al cargar tesis eliminadas:", error);
    }
  });

  // Cerrar el modal y ocultar el overlay
  closeModalButton.addEventListener("click", () => {
    console.log("Botón 'Cerrar' clickeado");
    modal.style.display = "none";
    overlay.style.display = "none";
  });

  // Cerrar el modal al hacer clic en el overlay
  overlay.addEventListener("click", () => {
    console.log("Overlay clickeado");
    modal.style.display = "none";
    overlay.style.display = "none";
  });
});