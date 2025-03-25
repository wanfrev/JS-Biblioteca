export async function verificarSesionAdmin() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/verify", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      window.location.href = "login-admin.html";
    }
  } catch {
    window.location.href = "login-admin.html";
  }
}

export async function verificarSesionInvitado() {
  try {
    const res = await fetch("http://localhost:5000/api/guest/verify", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      window.location.href = "login-guest.html";
    }
  } catch {
    window.location.href = "login-guest.html";
  }
}
