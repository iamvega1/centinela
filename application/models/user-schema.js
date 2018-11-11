'use strict';

const mongoose = require('./model'),
	Schema = mongoose.Schema,
	UserSchema = new Schema({
		username : {
            type: String,
            required: true
        },
		password : {
            type: String,
            required: true
        },
        rol : {
        	type : String,
        	required : false
        }
	},
	{
		collection : 'user'
	}),
	Auth = mongoose.model('User', UserSchema);

module.exports = Auth;