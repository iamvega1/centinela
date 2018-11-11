'use strict';
const conn = require('./sitioWeb-schema'),
	req = require('request');

class SitioWebModel {
    getAll(cb) {
    	var p = [];
        conn.find({}, (err, docs) => {
            if (err) throw err;
            cb(docs);
        });
    }

    actualizarStatus(cb, _t){
    	let p = [];
    	let _this = this;

		_this.getAll((docs) => {
			let lthDocs = docs.length;
			for(let i = 0; i < lthDocs; i++){
				p.push(_this.revisarStatus(docs[i]));
			}
			Promise.all(p).then(function(results) {
				for(let i = 0; i < lthDocs; i++){
					_this.save(docs[i], () => {});
				}
				cb(docs, _t);
			})
		});
    }

    getOne(_id, cb) {
		conn.findOne({_id : _id}, (err, docs) => {
			if(err) throw err;
			cb(docs);
		});
	}

    save(data, cb) {
		conn.count({_id : data._id}, (err, count) => {
			if(err) throw err;
			//console.log(`Número de Docs: ${count}`);

			if(count == 0) {
				conn.create(data, (err) => {
					if(err) throw err;
					this.actualizarStatus(dat => {});
					cb();
				});
				
			} else if(count == 1) {
				conn.findOneAndUpdate(
					{_id : data._id},
					{
						dominio: data.dominio,
						name: data.name,
						estado: data.estado,
						alerta: data.alerta,
						descripcion: data.descripcion,
						servidor: data.servidor,
						database: data.database,
						software: data.software,
						version: data.version,
						ipLocal: data.ipLocal,
						ipPublica: data.ipPublica,
						estatus: data.estatus
					},
					(err) => {
						if(err) throw(err);
						cb();
					}
				);
			}
		});
	}

	delete(_id, cb) {
		conn.remove({_id : _id}, (err) => {
			if(err) throw err;
			cb();
		});
	}

	revisarStatus (obj, protocolo) {

		const OK = 200,
			protocoloDefault = 'http',
			protocoloAuxiliar = 'https',
			_this = this;
		protocolo = typeof protocolo !== 'undefined' ? protocolo : protocoloDefault;

		let option = {
			method: 'GET', 
			uri: protocolo + '://' + obj.dominio,
			"rejectUnauthorized": false,
			timeout: 1500 
		};
		
		return new Promise(	(resolve, reject) => {
			req(option, (err, res, body) => {
				/* 
					Primero se revisa si existe una respuesta
						-Existe.- Se compara la variable statusCode vs OK
							-Concide. se retorna un true (Online). 
							-No concide. Se retorna un false (Offline).
						-No existe.- Se compara la variable protocolo vs protocoloDefault.
									-Concide. se autoejecuta la funcion pero enviado el parametro protocoloAuxiliar.
									-No concide. se retorna un false (Offline).
				*/
				obj.estatus = 
					(typeof res != 'undefined') 
						? (res.statusCode == OK) 
							? true 
							: false 
						: (protocolo === protocoloDefault) 
							? _this.revisarStatus(obj, protocoloAuxiliar) 
							: false ;
				resolve();
			});
		});		
	}
}

module.exports = new SitioWebModel();