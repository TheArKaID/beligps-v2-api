import models from '../models/index.js'
import Joi from 'joi';
import paginator from '../helpers/Paginator.js';

const controllers = {};

controllers.index = async (req, res) => {
    const { page, size } = req.query;

    const { limit, offset } = paginator.getPagination(page, size);

    var devices = await models.Device.findAndCountAll({
        limit,
        offset,
        where: {
            owned_by: 'User',
            owner_id: req.user.id,
        }
    })
  
    const response = paginator.getPagingData(devices, page, limit);

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': response
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
        return res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    return res.status(200).json({
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

    const { error, value } = schema.validate(req.body)

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
        })
    } 

    const device = await models.Device.create({
        name: value.name,
        imei: value.imei,
        owned_by: 'User',
        owner_id: req.user.id,
        attributes: value.attributes,
        phone: value.phone,
        created_by: req.user.name,
        updated_by: req.user.name,
    })

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

controllers.update = async (req, res) => {
    const schema = Joi.object({
        phone: Joi.string().optional(),
        attributes: Joi.object().optional(),
        status: Joi.string().optional(),
        disabled: Joi.boolean().optional(),
    })

    const { error, value } = schema.validate(req.body)

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
        return res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    device.phone = value.phone
    device.attributes = value.attributes
    device.updated_by = req.user.name
    device.status = value.status
    device.disabled = value.disabled

    await device.save()

    return res.status(200).json({
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
        return res.status(404).json({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    await device.destroy()

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': device
    })
}

export default controllers