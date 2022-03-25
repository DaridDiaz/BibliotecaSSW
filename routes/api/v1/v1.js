const express = require('express');
const router = express.Router();
const { verifyApiHeaderToken } =
  require('./headerVerifyMiddleware');
const middlewares = require('./headerVerifyMiddleware');

const pacientesRoutes = require('./pacientes/pacientes');
const clientesRoutes = require('./clientes/clientes');
//middlewares
router.use(
  '/pacientes',
  verifyApiHeaderToken,
  pacientesRoutes
);
router.use(
  '/clientes', 
  verifyApiHeaderToken,
  clientesRoutes
);

module.exports = router;
