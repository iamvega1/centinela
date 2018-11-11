'use strict';

const swc = require('../controllers/sitioWeb-controller'),
    express = require('express'),
    router = express.Router(),
    {authenticatedPermisos} = require('../helpers/auth-helper');

router
    .get('/home', swc.getAll)
    .get('/add', authenticatedPermisos, swc.addForm)
    .post('/sitios', authenticatedPermisos, swc.save)
    .get('/editar/:_id', authenticatedPermisos, swc.getOne)
    .put('/actualizar/:_id', authenticatedPermisos, swc.save)
    .delete('/eliminar/:_id', authenticatedPermisos, swc.delete);

module.exports = router;