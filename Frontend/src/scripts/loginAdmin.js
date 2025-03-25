// Define la función loginAdmin en el ámbito global
async function loginAdmin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/api/admin/login", { // URL completa del backend
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    try {
        const data = await response.json();
        if (response.ok) {
            if (data.isAdmin) {
                window.location.href = "home-admin.html";
            } else {
                alert("No tienes permisos de administrador");
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error al procesar la respuesta:", error);
        alert("Error inesperado");
    }
}

document.addEventListener("DOMContentLoaded", () => {
});