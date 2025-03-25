// Archivo de lógica de la aplicación para la biblioteca virtual

// Simulación de base de datos de tesis
const tesis = [
    { id: 1, title: "Tesis de Ejemplo 1", author: "Autor 1", career: "Ingeniería", date: "2023-01-01", pdf: "assets/tesis/example.pdf" },
    { id: 2, title: "Tesis de Ejemplo 2", author: "Autor 2", career: "Medicina", date: "2023-02-01", pdf: "assets/tesis/example.pdf" },
    // Agregar más tesis según sea necesario
];

let currentUser = null; // Almacena la sesión del usuario actual

// Función para iniciar sesión como visitante o admin
function login(userType) {
    currentUser = userType;
}

// Función para cerrar sesión
function logout() {
    currentUser = null;
}

// Función para mostrar las tesis
function displayTesis(filter = {}) {
    const tesisContainer = document.getElementById('tesis-container');
    tesisContainer.innerHTML = ''; // Limpiar el contenedor

    const filteredTesis = tesis.filter(t => {
        return (!filter.career || t.career === filter.career) &&
               (!filter.author || t.author === filter.author) &&
               (!filter.date || t.date === filter.date);
    });

    filteredTesis.forEach(t => {
        const tesisElement = document.createElement('div');
        tesisElement.className = 'tesis-item';
        tesisElement.innerHTML = `
            <h3>${t.title}</h3>
            <p>Autor: ${t.author}</p>
            <p>Carrera: ${t.career}</p>
            <p>Fecha: ${t.date}</p>
            <a href="${t.pdf}" target="_blank">Ver PDF</a>
        `;
        tesisContainer.appendChild(tesisElement);
    });
}

// Función para agregar una nueva tesis (solo para admin)
function addTesis(newTesis) {
    if (currentUser === 'admin') {
        tesis.push(newTesis);
        displayTesis();
    } else {
        alert("Solo el administrador puede agregar tesis.");
    }
}

// Función para eliminar una tesis (solo para admin)
function deleteTesis(id) {
    if (currentUser === 'admin') {
        const index = tesis.findIndex(t => t.id === id);
        if (index !== -1) {
            tesis.splice(index, 1);
            displayTesis();
        }
    } else {
        alert("Solo el administrador puede eliminar tesis.");
    }
}

// Función para buscar tesis
function searchTesis(query) {
    const filter = {
        title: query,
        // Se pueden agregar más filtros aquí
    };
    displayTesis(filter);
}

// Función para filtrar tesis
function filterTesis(career, author, date) {
    const filter = {
        career: career,
        author: author,
        date: date,
    };
    displayTesis(filter);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    displayTesis(); // Mostrar todas las tesis al cargar
});