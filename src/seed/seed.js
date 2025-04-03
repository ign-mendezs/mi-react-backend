// Este script se encarga de insertar roles y permisos por defecto en la base de datos
// si no existen. Se ejecuta al inicio del proyecto.

const { Role, Permission } = require('../models'); // Importa los modelos ya definidos

const seedDefaultData = async () => {
  try {
    // Crear o buscar el rol 'admin'
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: {
        description: 'Administrador del sistema'
      }
    });

    // Crear o buscar el rol 'user'
    const [userRole] = await Role.findOrCreate({
      where: { name: 'user' },
      defaults: {
        description: 'Usuario estándar'
      }
    });

    // Permisos por defecto
    const defaultPermissions = [
      { name: 'create_user', description: 'Permite crear usuarios' },
      { name: 'delete_user', description: 'Permite eliminar usuarios' },
      { name: 'view_dashboard', description: 'Permite ver el dashboard' }
    ];

    // Insertar permisos y asociarlos
    for (const permData of defaultPermissions) {
      const [permission] = await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: { description: permData.description }
      });
      
      // Asociar permisos al rol admin (todos)
      await adminRole.addPermission(permission);

      // Asociar a rol user solo el permiso 'view_dashboard'
      if (permData.name === 'view_dashboard') {
        await userRole.addPermission(permission);
      }
    }

    console.log('Datos semilla insertados correctamente');
  } catch (error) {
    console.error('Error al insertar datos semilla:', error);
  }
};

module.exports = seedDefaultData;
