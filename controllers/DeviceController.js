import models from '../models/index.js'
import Joi from 'joi';

const controllers = {};

controllers.index = async (req, res) => {
    var devices = await models.Device.findAll({
        where: {
            owned_by: 'User',
            owner_id: req.user.id,
        }
    })
  
    res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': devices
    })
}

controllers.show = async (req, res) => {
    const imei = req.params.imei

    const device = await models.Device.findOne({ 
        where: {
            imei,
            owned_by: 'User',
            owner_id: req.user.id,
        }
    })

    if (!device) {
        res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

controllers.store = async (req, res) => {
    const schema = Joi.object({
        imei: Joi.string().required(),
        phone: Joi.string().optional(),
        attributes: Joi.object().optional(),
    })

    const { error } = schema.validate(req.body)

    if (error) {
        res.status(400).json({
            'status': 400,
            'message': 'Validation Failed',
            'response': error.details.map((err) => {
                return {
                    'field': err.context.key,
                    'key': err.type,
                    'message': err.message
                }
            })
        })
    } 

    const device = await models.Device.create({
        name: req.body.name,
        imei: req.body.imei,
        owned_by: 'User',
        owner_id: req.user.id,
        attributes: req.body.attributes,
    })

    res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

controllers.update = async (req, res) => {
    const schema = Joi.object({
        phone: Joi.string().optional(),
        attributes: Joi.object().optional(),
    })

    const { error } = schema.validate(req.body)

    if (error) {
        res.status(400).json({
            'status': 400,
            'message': 'Validation Failed',
            'response': error.details.map((err) => {
                return {
                    'field': err.context.key,
                    'key': err.type,
                    'message': err.message
                }
            })
        })
    }

    const imei = req.params.imei

    const device = await models.Device.findOne({ 
        where: {
            imei,
            owned_by: 'User',
            owner_id: req.user.id,
        }
    })

    if (!device) {
        res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    device.phone = req.body.phone
    device.attributes = req.body.attributes
    await device.save()

    res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

controllers.destroy = async (req, res) => {
    const imei = req.params.imei

    const device = await models.Device.findOne({ 
        where: {
            imei,
            owned_by: 'User',
            owner_id: req.user.id,
        }
    })

    if (!device) {
        res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    await device.destroy()

    res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

export default controllers