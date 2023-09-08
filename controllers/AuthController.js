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
        password: joi.string().min(8).alphanum().required()
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
    const jsontoken = jwt.sign({ user }, config.secret.key, {
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

controllers.register = async (req, res, next) => {
    const schema = joi.object({
        username: joi.string().required(),
        // Password should be confirmed
        password: joi.string().min(8).alphanum().required(),
        confirm_password: joi.string().min(8).alphanum().required(),
        name: joi.string().required(),
        email: joi.string().email().required(),
        phone: joi.string().required(),
        address: joi.string().required(),
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

    if(value.password != value.confirm_password){
        return res.status(400).json({
            'status': 400,
            'message': 'Validation Failed',
            'response': [
                {
                    'field': 'confirm_password',
                    'key': 'string.match',
                    'message': 'Password Confirmation Does Not Match'
                }
            ]
        })
    }

    const user = await models.User.findOne({ where: { username: value.username }})

    if(user){
        return res.status(400).json({
            'status': 400,
            'message': 'Username Already Taken',
        })
    }

    const email = await models.User.findOne({ where: { email: value.email }})
    if(email){
        return res.status(400).json({
            'status': 400,
            'message': 'Email Already Taken',
        })
    }

    const phone = await models.User.findOne({ where: { phone: value.phone }})
    if(phone){
        return res.status(400).json({
            'status': 400,
            'message': 'Phone Already Taken',
        })
    }

    const hashedPassword = await bcryptjs.hash(value.password, 10);
    const data = {
        username: value.username,
        password: hashedPassword,
        name: value.name,
        email: value.email,
        phone: value.phone,
        address: value.address,
        created_by: 'register',
        updated_by: 'register'
    }

    const user_data = await models.User.create(data)
    user_data.password = undefined;

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': user_data
    });
}

export default controllers