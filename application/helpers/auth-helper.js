const errors = require('../controllers/errors');
module.exports = {
	authenticatedPermisos: function(req, res, next){
		return (req.session.rol == 'admin')
			? next()
			: errors.http401(req, res, next);
	}
}