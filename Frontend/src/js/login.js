async function loginAsGuest(nombre) {
  const response = await fetch('http://localhost:5000/api/guest/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ nombre })
  });
  
  const data = await response.json();
  if (response.ok) {
    alert('Login exitoso como invitado');
    window.location.href = 'home-guest.html';
  } else {
    alert(data.error);
  }
}

async function loginAsAdmin(username, password) {
  const response = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (response.ok) {
    alert('Login exitoso como administrador');
    window.location.href = 'home-admin.html';
  } else {
    alert(data.error);
  }
}
