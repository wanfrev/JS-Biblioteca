const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token no válido.' });
  }
};

module.exports = authMiddleware;