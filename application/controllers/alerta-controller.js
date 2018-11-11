'use strict';

const am = require('../models/alerta-model'),
	errors = require('../controllers/errors');

class SitioWebController {

	index(req, res, next) {
		let conf = am.getConf();
		res.render('alerta/index', {
			title: 'Sistema de Alertas',
			rol: req.session.rol,
			data: conf
		});
	}

	getData(req, res, next) {
		let data = am.getData();
		res.json(data);
	}

	getDash(req, res, next) {
		res.render('alerta/dash', {
			title: 'DashBoard',
			year: new Date().getFullYear(),
			rol: req.session.rol
		});
	}

	saveIntervalo(req, res, next) {
		let inter = req.body.intervalo
		return am.saveIntervalo( inter, () => res.redirect('/alerta') );
	}

	updateMail(req, res, next) {
		let mail = {
			from : req.body.txtFrom,
			asunto : req.body.txtAsunto,
			texto : req.body.txtTexto
		}
		console.log(mail)
		return am.updateMail( mail, () => res.redirect('/alerta') );
	}

	updateRemitente(req, res, next) {
		let user = {
			username: req.body.username,
			password: req.body.password
		};
		return am.updateRemitente( user, () => res.redirect('/alerta') );
	}

	saveEmail(req, res, next) {
		let email = req.body.newEmail
		console.log(email)
		return am.saveEmail( email, () => res.redirect('/alerta') );
	}

    swichEstado(req, res, next) {
		return am.swichEstado( () => res.redirect('/alerta') );
	}

	detenerCicloXTiempo(req, res, next) {
		let hrs = req.body.lapso
		return am.detenerCicloXTiempo( hrs, () => res.redirect('/alerta') );
	}

	delete(req, res, next) {
		let correo = req.params.correo;
		console.log(correo);

		try{
			return am.delete( correo, () => res.redirect('/alerta') );
		} catch(e){
			console.log(e.name + ": " + e.message)
			errors.http500(req, res, next)
		}		
	}
}

module.exports = new SitioWebController();