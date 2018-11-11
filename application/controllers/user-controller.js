'use strict';

const UserModel = require('../models/user-model'),
	bcrypt = require('bcryptjs'),
	errors = require('../controllers/errors'),
	um = new UserModel();

class AuthController {

	index(req, res, next) {
		if ( req.session.rol ) {
			res.redirect('/home');
		} else {
			res.render('usuarios/login-form', {
				title: 'Autenticación de Usuarios',
				message: req.query.message
			});
		}
	}

	getAll(req, res, next) {
		um.getAll((docs) => {
			res.render('usuarios/admin', {
		        title: 'Administración de Usuario',
		        data: docs,
		        rol : req.session.rol
			});
		})
    }

    getOne(req, res, next) {
		let _id = req.params._id;
		console.log(_id);

		return um.getOne(_id, (docs) => {
			res.render('usuarios/edit', {
				title : 'Editar usuario',
				rol : req.session.rol,
				data : docs
			})
		})
	}

	addForm(req, res, next) {
		res.render('usuarios/add', {
			title: 'Agregar Usuario',
			rol : req.session.rol
		});
    }

    save(req, res, next) {
    	let salt = bcrypt.genSaltSync(12),
    		ok =  () => res.redirect('/usuarios/admin'),
    		err =  () => res.render(`usuarios/add`, 
					{
						title : 'Agregar usuario', 
						rol : req.session.rol, 
						data : user,
						message : 'Error: El usuario ya existe'
					}
				),
    		user = {
				_id: (req.body._id || null),
				username: req.body.username,
				password: req.body.password,
				Repassword: req.body.Repassword,
				rol: req.body.rol
			};

		return (user.password == user.Repassword && user.password.length > 5)
			? (user.password=bcrypt.hashSync(user.password, salt), um.save( user, ok, err ))
			: res.render('usuarios/add', {
				title: 'Agregar usuario',
				rol : req.session.rol,
				username : user.username,
				message : 'Error: La contraseña no concide o formato incorrecto'
			});
	}

	actualizar(req, res, next) {
    	let salt = bcrypt.genSaltSync(12),
    		user = {
				_id: (req.body._id || null),
				username: req.body.username,
				password: req.body.password,
				Repassword: req.body.Repassword,
				rol: req.body.rol
			};
		console.log(user);
		let ok =  () => res.redirect('/usuarios/admin');
    	return (user.password == user.Repassword && user.password.length >= 5)
    		? (user.password=bcrypt.hashSync(user.password, salt), um.actualizar( user, ok))
    		: res.render('usuarios/edit', {
				title : 'Agregar usuario',
				rol : req.session.rol,
				data : user,
				message : 'Error: La contraseña no concide o formato incorrecto'
			});
	}

	logInGet(req, res, next) {
		res.redirect('/');
	}

	logInPost(req, res, next) {
		let user = {
			username: req.body.username,
			password: req.body.password
		},
		errorAuth = {
			title: 'Autenticación de Usuarios',
			message: 'Error: Usuario o password incorrectos',
			username: user.username
		};

		console.log(user);

		um.getUser(user, (docs) => {
			if(docs == null) return res.render('usuarios/login-form', errorAuth)

			return (bcrypt.compareSync(user.password, docs.password))
				? (req.session.rol = docs.rol, res.redirect('/'))
				: res.render('usuarios/login-form', errorAuth)
		});
	}

	signInGet(req, res, next) {
		res.render('usuarios/signin-form', { title: 'Registro de Usuarios' });
	}

	signInPost(req, res, next) {
		let salt = bcrypt.genSaltSync(12),
			user = {
				user_id: 0,
				username: req.body.username,
				password: req.body.password,
				rol: req.body.rol
			};

		user.password = bcrypt.hashSync(user.password, salt);
		console.log(user);

		um.setUser(user, (docs) => {
			res.redirect(`/?message=El usuario ${user.username} ha sido creado`);
		});
	}
	
	logOut(req, res, next) {
		req.session.destroy((err) => {
			return (err)
					? errors.http500(req, res, next)
					: res.redirect('/');
		});
	}

	delete(req, res, next) {
		let _id = req.params._id;
		console.log(_id);

		return um.delete( _id, () => res.redirect('/usuarios/admin') );
	}
}

module.exports = AuthController;