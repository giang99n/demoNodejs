const Joi = require('joi');

const userValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().alphanum().min(6).max(30).required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,128}$')),
		email: Joi.string().min(6).email(),
		phone:Joi.string().min(9),
	});
	return schema.validate(data);
};


module.exports.userValidation = userValidation;