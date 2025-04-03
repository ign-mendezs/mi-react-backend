// Rutas protegidas que requieren permisos específicos.
// En este ejemplo, se define una ruta para eliminar un usuario que requiere el permiso 'delete_user'.
//Demuestra cómo proteger endpoints con comprobaciones de autenticación y autorización basada en permisos.

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware');

// Ruta para eliminar un usuario (requiere el permiso 'delete_user')
router.delete('/users/:id', authenticateUser, permissionMiddleware('delete_user'), (req, res) => {
  // Aquí implementarías la lógica para eliminar el usuario (por ejemplo, llamando a un controlador)
  res.json({ message: "Usuario eliminado" });
});

module.exports = router;
