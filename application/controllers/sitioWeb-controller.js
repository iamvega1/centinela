'use strict';

const swm = require('../models/sitioWeb-model'),
errors = require('../controllers/errors');

class SitioWebController {

    getAll(req, res, next) {
        return (req.session.rol)
        	? swm.getAll((docs) => {
        		res.render('home', {
	                title: 'Administración de Sitios Web',
	                data: docs,
	                rol : req.session.rol
            	});
        	})
        	: errors.http401(req, res, next);
    }

    getOne(req, res, next) {
		let _id = req.params._id;
		console.log(_id);

		return swm.getOne(_id, (docs) => {
			res.render('edit', {
				title : 'Editar Sitio',
				rol : req.session.rol,
				data : docs
			})
		});
	}

    addForm(req, res, next) {
    	res.render('add', {
			title: 'Agregar Sitio Web',
			rol : req.session.rol
    	})
    }

    save(req, res, next) {
		let sitio = {
			_id: (req.body._id || null),
			dominio: req.body.dominio,
			name: req.body.name,
			estado: req.body.estado,
			alerta: req.body.alerta,
			descripcion: req.body.descripcion,
			servidor: req.body.servidor,
			database: req.body.database,
			software: req.body.software,
			version: req.body.version,
			ipLocal: req.body.ipLocal,
			ipPublica: req.body.ipPublica,
			estatus: req.body.estatus
		};
		
		console.log(sitio);

		return swm.save( sitio, () => res.redirect('/') );
	}

	delete(req, res, next) {
		let _id = req.params._id;
		console.log(_id);

		return swm.delete( _id, () => res.redirect('/') );
	}
}

module.exports = new SitioWebController();