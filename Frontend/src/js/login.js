export async function loginGuest(nombre) {
  try {
    const res = await fetch("http://localhost:5000/api/guest/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔹 HABILITA EL ENVÍO DE COOKIES
      body: JSON.stringify({ nombre }),
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);
  } catch (error) {
    console.error("Error en login:", error);
  }
}


export async function loginAdmin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ¡Importante para que se guarde la cookie!
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.isAdmin) {
      window.location.href = "home-admin.html";
    } else {
      alert(data.error || "Credenciales inválidas");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Error inesperado al iniciar sesión");
  }
}
