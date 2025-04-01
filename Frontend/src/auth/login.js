// login.js - Funciones para login de guest y admin

export async function loginGuest() {
  try {
    const response = await fetch("http://localhost:5000/api/guest/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: "Invitado" }), // Enviar un nombre genérico
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "guest");
      window.location.href = "home-guest.html";
    } else {
      alert(data.error || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error inesperado");
  }
}

export async function loginAdmin() {
  const username = document.getElementById("admin-email").value; // Cambiado de "username" a "admin-email"
  const password = document.getElementById("admin-password").value; // Cambiado de "password" a "admin-password"

  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token && data.isAdmin) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "admin");
      window.location.href = "home-admin.html";
    } else {
      alert(data.error || "Credenciales inválidas");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error inesperado al iniciar sesión");
  }
}
