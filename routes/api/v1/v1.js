const express = require('express');
const router = express.Router();

const { verifyApiHeaderToken } =
  require('./headerVerifyMiddleware');

const {passport, jwtMiddleware} = require('./seguridad/jwtHelper');

const empleadosRoutes = require('./empleados/empleados');
const librosRoutes = require('./libros/libros');
const prestamosRoutes = require('./prestamos/prestamos');
const seguridadRoutes = require('./seguridad/seguridad');
// const expedientesRoutes = require('./expedientes/expedientes');
router.use(passport.initialize());
//public

router.use('/seguridad', verifyApiHeaderToken, seguridadRoutes);

//************middlewares
//Empleados
router.use(
  '/empleados',
  verifyApiHeaderToken,
  empleadosRoutes
);

//Libros
router.use(
  '/libros',
  verifyApiHeaderToken,
  librosRoutes
);

//Prestamos
router.use(
  '/prestamos',
  verifyApiHeaderToken,
  prestamosRoutes
);
// router.use('/expedientes', expedientesRoutes);

module.exports = router;
