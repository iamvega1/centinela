'use strict';

const ac = require('../controllers/alerta-controller'),
    express = require('express'),
    router = express.Router(),
    {authenticatedPermisos} = require('../helpers/auth-helper');

router
    .get('/alerta', authenticatedPermisos, ac.index)
    .get('/alerta/data', authenticatedPermisos, ac.getData)
    .get('/alerta/dashboard', authenticatedPermisos, ac.getDash)
    .post('/alerta/email', authenticatedPermisos, ac.saveEmail)
    .put('/alerta', authenticatedPermisos, ac.saveIntervalo)
    .put('/alerta/mail', authenticatedPermisos, ac.updateMail)
    .put('/alerta/remitente', authenticatedPermisos, ac.updateRemitente)
    .put('/alerta/actualizar/estado', authenticatedPermisos, ac.swichEstado)
    .put('/alerta/actualizar/estado/tiempo', authenticatedPermisos, ac.detenerCicloXTiempo)
    .delete('/alerta/correo/:correo', authenticatedPermisos, ac.delete);

module.exports = router;