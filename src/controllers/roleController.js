// /src/controllers/roleController.js
const db = require('../config/database');

const roleController = {
  listRoles: (req, res) => {
    db.all("SELECT * FROM roles", (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al obtener roles' });
      res.json(rows);
    });
  },
  listPermissions: (req, res) => {
    db.all("SELECT * FROM permissions", (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error al obtener permisos' });
      res.json(rows);
    });
  }
};

module.exports = roleController;
