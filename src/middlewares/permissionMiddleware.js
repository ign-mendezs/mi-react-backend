// Middleware que verifica si el usuario autenticado tiene un permiso específico.
// Se utiliza en rutas que requieren autorización adicional (ej. eliminar un usuario).
//Permite proteger endpoints de acciones sensibles, comprobando permisos específicos de forma centralizada y reutilizable

const { userHasPermission } = require('../models/AccessControl');

const permissionMiddleware = (permission) => {
  return async (req, res, next) => {
    // Se asume que authenticateUser ya asignó req.user
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    try {
      const hasPermission = await userHasPermission(userId, permission);
      if (!hasPermission) {
        return res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
      }
      next();
    } catch (error) {
      console.error("Error en permissionMiddleware:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
};

module.exports = permissionMiddleware;
