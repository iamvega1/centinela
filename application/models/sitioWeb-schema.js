'use strict';

const mongoose = require('./model'),
    Schema = mongoose.Schema,
    SitioWebSchema = new Schema({
        _id : Schema.Types.ObjectId,
        dominio: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        estado: {
            type: Boolean,
            required: false
        },
        alerta: {
            type: Boolean,
            required: false
        },
        descripcion: {
            type: String,
            required: false
        },
        servidor: {
            type: String,
            required: false
        },
        database: {
            type: String,
            required: false
        },
        software: {
            type: String,
            required: false
        },
        version: {
            type: String,
            required: false
        },
        ipLocal: {
            type: String,
            required: false
        },
        ipPublica: {
            type: String,
            required: false
        },
        estatus: {
            type: String,
            required: false
        }
    }, {
        collection: 'sitioWeb'
    }),
    SitioWeb = mongoose.model('SitioWeb', SitioWebSchema);

module.exports = SitioWeb;