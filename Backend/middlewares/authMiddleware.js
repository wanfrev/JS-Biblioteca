const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secreto';

// Verifica que haya un token válido
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = decoded;
    next();
  });
}

// Solo admins
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
}

// Solo invitados
function isGuest(req, res, next) {
  if (req.user && !req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso restringido a invitados' });
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isGuest
};
