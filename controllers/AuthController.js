"use strict";
const { compare } = require("bcryptjs");
const Joi = require('joi');
const models = require('../models/index');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

const controllers = {};

controllers.login = async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(4).alphanum().required()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': 'Validation Failed',
            error
        });
    }

    const user = await models.User.findOne({ where: { username: value.username }})

    if(!user){
        return res.status(400).json({
            'status': 400,
            'message': 'User Not Found',
        })
    }
    
    const comparePassword = await compare(value.password, checker.password)
    if (!comparePassword) {
        return res.status(400).json({
            'status': 400,
            'message': 'Invalid Credential',
        })
    }

    user.password = undefined;
    const jsontoken = jwt.sign({ comparePassword: user }, "J5onS3cR34T", {
        expiresIn: "1d"
    });
    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': {
            'token': jsontoken,
            'user': user
        }
    });
}