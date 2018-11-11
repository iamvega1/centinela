'use strict';
const conn = require('./user-schema'),
	errors = require('../controllers/errors'),
	bcrypt = require('bcryptjs');

class UserModel {

	getAll(cb) {
    	var p = [];
        conn.find({}, (err, docs) => {
            if (err) throw err;
            cb(docs);
        });
    }

	getUser(user, cb) {
		conn
			.findOne({
				username : user.username
			})
			.exec((err, docs) => {
				if (err) throw err;
				cb(docs);
			});
	}

	getOne(_id, cb) {
		conn.findOne({_id : _id}, (err, docs) => {
			if(err) throw err;
			cb(docs);
		});
	}

	save(data, cb, cbError) {

		conn.count({username : data.username}, (err, count) => {
			if(err) throw err;
			console.log(`Número de Docs: ${count}`);

			if(count == 0) {
				conn.create(data, (err) => {
					if(err) throw err;
					cb();
				});				
			} else if(count == 1) {
				cbError();
			}
		});
	}

	actualizar(data, cb) {
		conn.count({_id : data._id}, (err, count) => {
			if(err) throw err;
			console.log(`Número de Docs: ${count}`);

			if(count == 0) {
				cbError();				
			} else if(count == 1) {
				conn.findOneAndUpdate(
					{_id : data._id},
					{
						username: data.username,
						password: data.password,
						rol: data.rol
					},
					(err) => {
						if(err) throw(err);
						cb();
					}
				);
			}
		});
	}

	setUser(user, cb) {
		conn.create(user, (err) => {
			if(err) throw err;
			cb();
		});
	}

	delete(_id, cb) {
		conn.remove({_id : _id}, (err) => {
			if(err) throw err;
			cb();
		});
	}
}

module.exports = UserModel;