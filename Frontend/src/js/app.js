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

  if (isAdminPage()) {
    const editButton = document.getElementById("edit-button");
    if (editButton) {
      editButton.style.display = "block";
      editButton.onclick = () => {
        editTesis(tesis);
      };
    }
  }
}

function isAdminPage() {
  return window.location.pathname.includes("home-admin");
}

function editTesis(tesis) {
  const queryParams = new URLSearchParams({
    id: tesis.id_tesis,
    titulo: tesis.titulo,
    autor: tesis.autor,
    carrera: tesis.carrera,
    fecha_pub: tesis.fecha_pub,
    descripcion: tesis.des_tesis,
  });

  window.location.href = `upload-form.html?${queryParams.toString()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  displayTesis();
});
