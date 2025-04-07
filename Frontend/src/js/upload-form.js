document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // Detectar si es edición o creación

  try {
    const response = await fetch(`http://localhost:5000/api/upload${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST", // Usar PUT si se está editando, POST si es nuevo
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.mensaje); // Mostrar mensaje de éxito
      e.target.reset(); // Limpiar el formulario
      window.location.href = "home-admin.html"; // Redirigir al home-admin
    } else {
      alert(data.error || "Error al guardar la tesis");
    }
  } catch (error) {
    console.error("Error al guardar la tesis:", error);
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

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/${id}`);
      const tesis = await response.json();

      document.getElementById("titulo").value = tesis.titulo;
      document.getElementById("nom_autor").value = tesis.autor;
      document.getElementById("id_carrera").value = tesis.id_carrera;
      document.getElementById("fecha_pub").value = tesis.fecha_pub;
      document.getElementById("des_tesis").value = tesis.des_tesis;
    } catch (error) {
      console.error("Error al cargar los datos de la tesis:", error);
    }
  }
});
