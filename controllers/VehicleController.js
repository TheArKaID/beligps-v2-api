import models from '../models/index.js'
import Joi from 'joi';
import paginator from '../helpers/Paginator.js';
import { Op } from 'sequelize'

const controllers = {};

controllers.index = async (req, res, next) => {
    const { page, size, search } = req.query;

    let condition = search ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { plat_number: { [Op.like]: `%${search}%` } },
        ]
    } : {}

    condition.user_id = req.user.id

    const { limit, offset } = paginator.getPagination(page, size);

    var vehicles = await models.Vehicle.findAndCountAll({
        limit,
        offset,
        where: condition,
        include: [
            {
                model: models.Device,
                as: 'devices',
                attributes: ['id', 'imei', 'phone', 'status', 'attributes'],
                where: {
                    [Op.or]: [
                        { imei: { [Op.like]: `%${search}%` } },
                        { phone: { [Op.like]: `%${search}%` } },
                    ]
                },
                required: false
            }
        ],
    })
  
    const response = paginator.getPagingData(vehicles, page, limit);

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': response
    })
}

controllers.show = async (req, res, next) => {
    const id = req.params.id

    const vehicle = await models.Vehicle.findOne({ 
        where: {
            id,
            user_id: req.user.id,
        },
        include: [
            {
                model: models.Device,
                as: 'devices',
                attributes: ['id', 'imei', 'phone', 'status', 'attributes']
            }
        ],
        required: false
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': vehicle
    })
}

controllers.store = async (req, res, next) => {
    try {
        const schema = Joi.object({
            type: Joi.string().valid('Truck', 'Car', 'Motorcycle', 'Other').required(),
            plat_number: Joi.string().regex(/^[A-Z]{1,2}\s{0,1}[0-9]{1,4}\s{0,1}[A-Z]{1,3}$/).optional(),
            name: Joi.string().optional(),
        })

        const { error, value } = schema.validate(req.body)

        if (error) {
            return next({
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

        let vehicle = await models.Vehicle.findOne({
            where: {
                plat_number: value.plat_number,
            }
        })

        if (vehicle) {
            return next({
                'status': 400,
                'message': 'Validation Failed',
                'response': [
                    {
                        'field': 'plat_number',
                        'key': 'unique',
                        'message': 'Plat Number already in use. Please use another plat_number, or contact administrator for more info'
                    }
                ]
            })
        }

        vehicle = await models.Vehicle.create({
            user_id: req.user.id,
            type: value.type,
            plat_number: value.plat_number,
            name: value.name,
            created_by: req.user.name,
            updated_by: req.user.name,
        })

        return res.status(200).json({
            'status': 200,
            'message': 'Success',
            'response': vehicle
        })
    } catch (error) {
        return next(error)
    }
}

controllers.update = async (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string().valid('Truck', 'Car', 'Motorcycle', 'Other').required(),
        plat_number: Joi.string().regex(/^[A-Z]{1,2}\s{0,1}[0-9]{1,4}\s{0,1}[A-Z]{1,3}$/).optional(),
        name: Joi.string().optional(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
        return next({
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

    const id = req.params.id

    const vehicle = await models.Vehicle.findOne({ 
        where: {
            id,
            user_id: req.user.id,
        }
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    vehicle.type = value.type
    vehicle.plat_number = value.plat_number
    vehicle.name = value.name
    vehicle.updated_by = req.user.name

    await vehicle.save()

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': vehicle
    })
}

controllers.destroy = async (req, res, next) => {
    const id = req.params.id

    const vehicle = await models.Vehicle.findOne({ 
        where: {
            id,
            user_id: req.user.id,
        }
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    await vehicle.destroy()

    return res.status(200).json({
        'status': 200,
        'message': 'Success',
        'response': vehicle
    })
}

export default controllers