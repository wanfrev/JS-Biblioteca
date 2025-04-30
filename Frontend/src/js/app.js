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
      deleteButton.onclick = () => {
        deleteTesis(tesis);
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

// Array para almacenar las tesis eliminadas junto con la fecha y hora de eliminación
const tesisEliminadasConHora = [];

export async function deleteTesis(tesis) {
  const confirmDelete = confirm(
    `¿Estás seguro de que deseas eliminar la tesis "${tesis.titulo}"?`
  );
  if (confirmDelete) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/${tesis.id_tesis}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Capturar la fecha y hora actuales al momento de la eliminación
        const fechaEliminacion = new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const horaEliminacion = new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Agregar la tesis eliminada al array global con la fecha y hora exactas
        tesisEliminadasConHora.push({
          ...tesis,
          fechaEliminacion, // Guardar la fecha de eliminación
          horaEliminacion,  // Guardar la hora de eliminación
        });

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
}

// Asegúrate de que deletedThesisList esté definida en el alcance global o accesible
const deletedThesisList = document.getElementById("deleted-thesis-list");

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
        const fechaEliminacion = new Date(tesis.fecha_hora_eliminacion).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const horaEliminacion = new Date(tesis.fecha_hora_eliminacion).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const listItem = document.createElement("li");
        listItem.className = "deleted-thesis-item"; // Clase CSS para estilizar el elemento
        listItem.innerHTML = `
          <span class="deleted-thesis-title">${tesis.titulo} - Eliminada el ${fechaEliminacion} a las ${horaEliminacion}</span>
        `;

        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restaurar";
        restoreButton.style.padding = "5px 20px";
        restoreButton.style.backgroundColor = "#18a642";
        restoreButton.style.color = "white";
        restoreButton.style.border = "none";
        restoreButton.style.borderRadius = "5px";
        restoreButton.style.cursor = "pointer";
        restoreButton.style.fontSize = "1rem";
        restoreButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        restoreButton.style.transition = "background-color 0.3s ease";

        restoreButton.addEventListener("click", async () => {
          try {
            const restoreResponse = await fetch(
              `http://localhost:5000/api/upload/restaurar/${tesis.id_tesis}`,
              { method: "POST" }
            );
            if (restoreResponse.ok) {
              alert("Tesis restaurada exitosamente");
              listItem.remove(); // Eliminar la tesis restaurada de la lista
              displayTesis(); // Actualizar la lista de tesis
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

  // Mostrar las tesis eliminadas con su fecha y hora de eliminación
  restoreButton.addEventListener("click", () => {
    // Limpiar la lista antes de agregar nuevos elementos
    deletedThesisList.innerHTML = "";

    tesisEliminadasConHora.forEach((tesis) => {
      const listItem = document.createElement("li");
      listItem.className = "deleted-thesis-item";
      listItem.innerHTML = `
        <span class="deleted-thesis-title">
          ${tesis.titulo} - Eliminada el ${tesis.fechaEliminacion} a las ${tesis.horaEliminacion}
        </span>
        <button class="restore-button" data-id="${tesis.id_tesis}">Restaurar</button>
      `;

      listItem.querySelector(".restore-button").addEventListener("click", async () => {
        try {
          const restoreResponse = await fetch(
            `http://localhost:5000/api/upload/restaurar/${tesis.id_tesis}`,
            { method: "POST" }
          );
          if (restoreResponse.ok) {
            alert(
              `Tesis restaurada exitosamente. Fue eliminada el ${tesis.fechaEliminacion} a las ${tesis.horaEliminacion}`
            );
            tesisEliminadasConHora.splice(tesisEliminadasConHora.indexOf(tesis), 1); // Eliminar del array
            listItem.remove(); // Eliminar del DOM
            displayTesis(); // Actualizar la lista de tesis
          } else {
            alert("Error al restaurar la tesis");
          }
        } catch (error) {
          console.error("Error al restaurar la tesis:", error);
        }
      });

      deletedThesisList.appendChild(listItem);
    });
  });
});
