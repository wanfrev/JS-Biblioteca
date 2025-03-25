export async function loginGuest() {
  const nombre = "Invitado"; // puedes hacerlo dinámico si agregas input

  const res = await fetch("http://localhost:5000/api/guest/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre }),
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "home-guest.html";
  } else {
    alert(data.error || "Error al iniciar sesión como invitado");
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
