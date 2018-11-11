'use strict';
const conn = require('./sitioWeb-schema'),
	fs = require('fs'),
	nodemailer = require('nodemailer'),
	sitiomodel = require('../models/sitioWeb-model');

class AlertConfModel {
    constructor(){
    	let _this = this
    	_this.ciclo = ''
		_this.pararCicloxTiempo = ''
    	_this.fileName = '../models/app-conf.json'
		_this.file = require(_this.fileName)
		_this.file.estado ? _this.startCiclo() : false
	}

	getConf(){
		this.file.detenidoXtiempo.fechaIni = Date.now()
		return this.file;
	}

	getData(){
		return this.file.historial;
	}

	saveIntervalo(inter, cb){
		let _this = this
		_this.file.intervalo = inter
		if (_this.file.estado){
			_this.stopCiclo()
			_this.startCiclo()
		}
		_this.writeFile(cb)
	}

	updateMail(mail, cb){
		let _this = this
		_this.file.mail.from = mail.from
		_this.file.mail.subject = mail.asunto
		_this.file.mail.text = mail.texto
		_this.writeFile(cb)
	}

	updateRemitente(user, cb){
		let _this = this
		_this.file.mail.user = user.username
		_this.file.mail.pass = user.password;
		_this.writeFile(cb)
	}

	saveEmail(email, cb){
		let _this = this
		_this.file.emails.push(email)
		_this.writeFile(cb)
	}

	swichEstado(cb){
		let _this = this
		_this.file.estado = !_this.file.estado
		_this.file.estado ? _this.startCiclo() : _this.stopCiclo()
		_this.file.detenidoXtiempo.estado ? (clearTimeout(_this.pararCicloxTiempo), _this.file.detenidoXtiempo.estado = false) : false
		_this.writeFile(cb)	
	}

	writeFile(cb, t){
		let fileName = './models/app-conf.json',
			_this = typeof t != 'undefined' ? t : this;
		fs.writeFile(fileName, JSON.stringify(_this.file), err => {
			if (err) return console.log(err)
			cb()
		})
	}

	delete(email, cb) {
		let _this = this,
		indice = -1

		indice = _this.file.emails.indexOf(email)
		if(indice < 0 || _this.file.emails.length === 1) throw new Error('Error: No existe el email');
		console.log(_this.file.emails.length)
		_this.file.emails.splice(indice, 1)
		_this.writeFile(cb)
	}

	startCiclo(){
		let _this =  this,
			intervalo = _this.file.intervalo * 1000 * 60,
			next = _this.notificar
		_this.ciclo = setInterval(() => {sitiomodel.actualizarStatus (	next, _this )}, intervalo)
	}

	stopCiclo(){
		let _this = this
		clearInterval(_this.ciclo)
	}

	detenerCicloXTiempo(hrs, cb){
		let _this = this,
			retraso = parseInt(hrs * (1000 * 60 * 60))
		_this.file.estado = false
		_this.file.detenidoXtiempo.estado = true
		_this.file.detenidoXtiempo.fechaIni = Date.now()
		_this.file.detenidoXtiempo.fechaFinal = Date.now() + retraso
		_this.stopCiclo()
		_this.pararCicloxTiempo = setTimeout(() => {
			_this.file.estado = true
			_this.file.detenidoXtiempo.estado = false
			_this.startCiclo()
		}, retraso)
		cb()
	}

	notificar(docs, _this){
		let arrayStios = []

		for(let i = 0; i < docs.length; i++){
			if(docs[i].estado && (docs[i].estatus == 'false' && docs[i].alerta)){
				_this.file.historial.push({ "dominio":docs[i].dominio, "intervalo": _this.file.intervalo, "fechaIni": Date.now() })
				arrayStios.push(docs[i]);
			}
		}

		if(!arrayStios.length) return console.log('No existe mails a quien notificar')

		_this.enviarMails(arrayStios, _this)
		_this.writeFile(()=> {return false}, _this)

	}

	enviarMails(sitios, _this){
		let lstMails = '',
			lstSitios = '<ul>'

		for(let i = 0; i < _this.file.emails.length; i++){
			lstMails += _this.file.emails[i] + ", ";
		}

		for(let u = 0; u < sitios.length; u ++){
			lstSitios += "<li>" + sitios[u].dominio + "</li>";
		}

		lstSitios += '</ul>';

		nodemailer.createTestAccount((err, account) => {

			let sub = _this.file.mail.subject.replace('#', sitios.length),
				txt = _this.file.mail.text.replace('#li', lstSitios);

			let transporter = nodemailer.createTransport({
				host: _this.file.mail.host,
				port: _this.file.mail.port,
				secure: true,
				auth: {
				    user: _this.file.mail.user, 
				    pass: _this.file.mail.pass
				}
			});

			let mailOptions = {
				from: `"${_this.file.mail.from}" <${_this.file.mail.user}>`,
				to: lstMails, // list of receivers
				subject: sub,
				html: txt
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
}

module.exports = new AlertConfModel();