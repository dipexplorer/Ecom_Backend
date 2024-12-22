const Joi = require('joi');

const productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        stock: Joi.number().required().min(0),
        image_url: Joi.string().allow("",null)
    }).required()
});

module.exports = {productSchema};