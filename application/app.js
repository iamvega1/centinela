'use strict';

const express = require('express'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    morgan = require('morgan'),
    restFul = require('express-method-override')('_method'),
    errors = require('./controllers/errors'),
    user = require('./routes/user-router'),
    alerta = require('./routes/alerta-router'),
    sitioWeb = require('./routes/sitioWeb-router'),
    path = require('path'),
    favicon = require('serve-favicon')(`${__dirname}/public/images/glasses.png`),
    publicDir = express.static(`${__dirname}/public`),
    viewDir = `${__dirname}/views`,
    optSession = { secret:'secret', saveUninitialized: true, resave: true },
    port = (process.env.PORT || 3000);


let app = express();

app
    .set( 'views', viewDir )
    .set( 'view engine', 'pug' )
    .set( 'port', port )

    .use( session(optSession) )
    .use( bodyParser.json() )
    .use( bodyParser.urlencoded({ extended: false }) )
    .use( restFul )
    .use( publicDir )
    .use( favicon )
    .use( morgan('dev') )

    .use( user )
    .use( alerta )
    .use( sitioWeb )
    .use( errors.http404 )
    .locals.basedir = path.join(__dirname, 'views');

module.exports = app;