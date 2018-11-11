'use strict';

const UserController = require('../controllers/user-controller'),
	express = require('express'),
	router = express.Router(),
	uc = new UserController(),
	{authenticatedPermisos} = require('../helpers/auth-helper');

router
	.get('/', uc.index)
	.get('/login', uc.logInGet)
	.post('/login', uc.logInPost)
	.get('/signin', uc.signInGet)
	.post('/signin', uc.signInPost)
	.get('/logout', uc.logOut)
	.post('/usuarios', authenticatedPermisos, uc.save)
	.put('/usuarios/actualizar/:_id', authenticatedPermisos, uc.actualizar)
	.get('/usuarios/admin', authenticatedPermisos, uc.getAll)
	.get('/usuarios/editar/:_id', authenticatedPermisos, uc.getOne)
	.get('/usuarios/add', authenticatedPermisos, uc.addForm)
	.delete('/usuarios/eliminar/:_id', authenticatedPermisos, uc.delete);
	
module.exports = router;