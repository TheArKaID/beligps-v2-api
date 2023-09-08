"use strict";
import bcryptjs from "bcryptjs";
import joi from 'joi';
import models from '../models/index.js';
import jwt from 'jsonwebtoken';
import config from '../config/app.js'

const controllers = {};

controllers.login = async (req, res, next) => {
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().min(4).alphanum().required()
    });
    
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': 'Validation Failed',
            'response': error.details.map((err) => {
                return {
                    'field': err.context.key,
                    'key': err.type,
                    'message': err.message
                }
            })
        });
    }

    const user = await models.User.findOne({ where: { username: value.username }})

    if(!user){
        return res.status(400).json({
            'status': 400,
            'message': 'User Not Found',
        })
    }
    
    const comparePassword = await bcryptjs.compare(value.password, user.password)
    if (!comparePassword) {
        return res.status(400).json({
            'status': 400,
            'message': 'Invalid Credential',
        })
    }

    user.password = undefined;
    const jsontoken = jwt.sign({ comparePassword: user }, config.secret.key, {
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

export default controllers