export async function loginGuest() {
  const nombre = "Invitado"; // Puedes obtener este valor de un input si es necesario

  try {
    const response = await fetch("http://localhost:5000/api/guest/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "home-guest.html"; // Redirigir al home de invitados
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error en login:", error);
  }
}


export async function loginAdmin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  console.log("Datos enviados:", { username, password });

  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.isAdmin) {
      localStorage.setItem("token", data.token); // Guarda el token en localStorage
      window.location.href = "home-admin.html";
    } else {
      alert(data.error || "Credenciales inválidas");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error inesperado al iniciar sesión");
  }
}
