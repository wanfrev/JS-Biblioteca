document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.mensaje);
      e.target.reset(); // Limpiar el formulario
    } else {
      alert(data.error || "Error al subir la tesis");
    }
  } catch (error) {
    console.error("Error al subir la tesis:", error);
    alert("Error inesperado");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const carreraSelect = document.getElementById("id_carrera");

  try {
    const response = await fetch("http://localhost:5000/api/carreras");
    const carreras = await response.json();

    carreras.forEach((carrera) => {
      const option = document.createElement("option");
      option.value = carrera.id_carrera; // ID de la carrera
      option.textContent = carrera.car_nom; // Nombre de la carrera
      carreraSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar carreras:", error);
  }
});