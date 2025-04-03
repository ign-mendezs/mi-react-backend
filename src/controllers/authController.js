// Controlador de autenticación: maneja el registro y login de usuarios.
// Registra usuarios (con hash de contraseña) e inicia sesión generando un token JWT.
// Se incluye la asignación de un rol por defecto ("user") en el registro.

const bcrypt = require("bcrypt");
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { Role } = require('../models');

const register = async (req, res) => {
  try {
    // Extrae nombre, email y contraseña del cuerpo de la petición.
    const { name, email, password } = req.body;
    // Hashea la contraseña con bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea el usuario en la base de datos con la contraseña hasheada.
    const newUser = await User.create({ name, email, password: hashedPassword });
    // Asigna el rol por defecto "user" (si existe)
    const defaultRole = await Role.findOne({ where: { name: 'user' } });
    if (defaultRole) {
      await newUser.addRole(defaultRole);
    }
    // Envía respuesta exitosa con código 201.
    return res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    // Retorna error 500 si ocurre algún fallo en el registro.
    return res.status(500).json({ error: "Error al registrar usuario" });
  }
};

const login = async (req, res) => {
  try {
    // Extrae email y contraseña del cuerpo de la petición.
    const { email, password } = req.body;
    // Busca el usuario por email en la base de datos.
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) 
      return res.status(401).json({ error: "Usuario no encontrado" });

    // Verifica que la contraseña ingresada coincida con la almacenada.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(401).json({ error: "Contraseña incorrecta" });
    
    // Genera un token JWT usando el usuario encontrado.
    const token = generateToken(user);

    // Envía el token en la respuesta.
    return res.json({ token });
  } catch (error) {
    // Retorna error 500 si ocurre algún fallo en el login.
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { register, login };
