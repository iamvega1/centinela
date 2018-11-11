'use strict';

const fs = require('fs'),
	fileName = '../models/app-conf.json',
	sitioWeb = require('../models/sitioWeb-model'),
	nodemailer = require('nodemailer');
let conf = require('../models/app-conf.json');

class ConfigHelper {
	initialize() {
		this.lapso = conf.intervalo;
		let interStatus = this.lapso * 1000 * 60,
			next = this.notificacion;
			setInterval(() => {sitioWeb.actualizarStatus ( next )}, (interStatus));
	};

	notificacion(docs){

		console.log("notificacion");
		let arrayStios = [];

		if(conf.alertar){
			
			for(let i = 0; i < docs.length; i++){
				if(docs[i].estado && (docs[i].estatus == 'false')){
					arrayStios.push(docs[i]);
				}
			}

			if(arrayStios.length){
				let lstMails = '',
					lstSitios = '<ul>';

				for(let i = 0; i < conf.mails.length; i++){
					lstMails += conf.mails[i] + ", ";
				}

				for(let u = 0; u < arrayStios.length; u ++){
					lstSitios += "<li>" + arrayStios[u].dominio + "</li>";
				}
				lstSitios += '</ul>';

				nodemailer.createTestAccount((err, account) => {

					let transporter = nodemailer.createTransport({
						host: conf.mail.host,
						port: conf.mail.port,
						secure: true,
						auth: {
						    user: conf.mail.user, 
						    pass: conf.mail.pass
						}
					});

					let mailOptions = {
						from: `"${conf.mail.from}" <${conf.mail.user}>`,
						to: lstMails, // list of receivers
						subject: `${conf.mail.subject} ${arrayStios.length} caidos`,
						html: '<b>Lista de sitios caidos</b>' + lstSitios
					};

					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
						    return console.log(error);
						}
						console.log('Message sent: %s', info.messageId);
						console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					});
				});
			}
		} else {
			console.log('Alarma desactivada');
		}
	}
}

module.exports = new ConfigHelper();