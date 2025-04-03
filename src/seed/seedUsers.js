const bcrypt = require("bcrypt");
const { User, Role } = require('../models');

const seedTestUsers = async () => {
  try {
    // Buscar los roles existentes
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const userRole = await Role.findOne({ where: { name: 'user' } });

    if (!adminRole || !userRole) {
      console.error('No se encontraron los roles necesarios. Ejecuta primero el seed de roles y permisos.');
      return;
    }

    // Crear el usuario con rol de admin
    const hashedPassword = await bcrypt.hash('password', 10);
    const [adminUser, createdAdmin] = await User.findOrCreate({
        where: { email: 'admin@test.com' },
        defaults: {
          name: 'Administrador de Prueba',
            password: hashedPassword
        }
    });
    // Asignar el rol de admin al usuario
    await adminUser.addRole(adminRole);

    // Crear el usuario con rol de user
    const [standardUser, createdUser] = await User.findOrCreate({
        where: { email: 'user@test.com' },
        defaults: {
          name: 'Usuario de Prueba',
        password: hashedPassword
        }
    });
    // Asignar el rol de user al usuario
    await standardUser.addRole(userRole);

    console.log('Usuarios semilla insertados correctamente');
  } catch (error) {
    console.error('Error al insertar usuarios semilla:', error);
  }
};

module.exports = seedTestUsers;
