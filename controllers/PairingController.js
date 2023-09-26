import models from '../models/index.js'
import Joi from 'joi';
import paginator from '../helpers/Paginator.js';
import { Op } from 'sequelize'

const controllers = {};

controllers.pair = async (req, res, next) => {
    const schema = Joi.object({
        // force: Joi.boolean().optional(),
        device_id: Joi.string().uuid().optional(),
        vehicle_id: Joi.string().uuid().optional(),
        imei: Joi.string().when('device_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
        plat_number: Joi.string().regex(/^[A-Z]{1,2}\s{0,1}[0-9]{1,4}\s{0,1}[A-Z]{1,3}$/).when('vehicle_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
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
    let where = {
        owned_by: 'User',
        owner_id: req.user.id
    }

    if (value.device_id) {
        where = {
            id: value.device_id,
        }
    } else {
        where = {
            imei: value.imei,
        }
    }

    const device = await models.Device.findOne({
        where: where,
        include: {
            model: models.Vehicle,
            as: 'vehicle',
            required: false
        }
    })

    if (!device) {
        return next({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    where = {
        user_id: req.user.id,
    }
    if (value.vehicle_id) {
        where = {
            id: value.vehicle_id,
        }
    } else {
        where = {
            plat_number: value.plat_number,
        }
    }

    var vehicle = await models.Vehicle.findOne({
        where: where,
        include: {
            model: models.Device,
            as: 'devices',
            required: false
        }
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    // Force will make sure that 1 device can be paired to 1 vehicle, and 1 vehicle only has 1 device
    // if (vehicle.devices) {
    //     if (value.force) {
    //         await vehicle.device.update({
    //             vehicle_id: null
    //         })
    //     } else {
    //         return next({
    //             'status': 400,
    //             'message': 'Device Already Paired',
    //         })
    //     }
    // }

    await device.update({
        vehicle_id: vehicle.id
    })

    await device.reload()

    return res.status(200).json({
        'status': 200,
        'message': 'Device and Vehicle Paired Successfully',
        'response': device
    })
}

controllers.unPair = async (req, res, next) => {
    const schema = Joi.object({
        device_id: Joi.string().uuid().optional(),
        vehicle_id: Joi.string().uuid().optional(),
        imei: Joi.string().when('device_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
        plat_number: Joi.string().regex(/^[A-Z]{1,2}\s{0,1}[0-9]{1,4}\s{0,1}[A-Z]{1,3}$/).when('vehicle_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
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
    let where = {
        owned_by: 'User',
        owner_id: req.user.id
    }
    if (value.device_id) {
        where = {
            id: value.device_id,
        }
    } else {
        where = {
            imei: value.imei,
        }
    }
    const device = await models.Device.findOne({
        where: where,
        include: {
            model: models.Vehicle,
            as: 'vehicle'
        }
    })

    if (!device) {
        return next({
            'status': 404,
            'message': 'Device Not Found',
        })
    }

    where = {
        user_id: req.user.id,
    }
    if (value.vehicle_id) {
        where = {
            id: value.vehicle_id,
        }
    } else {
        where = {
            plat_number: value.plat_number,
        }
    }

    var vehicle = await models.Vehicle.findOne({
        where: where
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    if (device.vehicle_id != vehicle.id) {
        return next({
            'status': 400,
            'message': 'Device and Vehicle Not Paired',
        })
    }

    await device.update({
        vehicle_id: null
    })

    await vehicle.reload()

    return res.status(200).json({
        'status': 200,
        'message': 'Device and Vehicle Unpaired Successfully',
        'response': vehicle
    })
}

controllers.unPairDevice = async (req, res, next) => {
    const schema = Joi.object({
        device_id: Joi.string().uuid().optional(),
        imei: Joi.string().when('device_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
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
    
    let where = {
        owned_by: 'User',
        owner_id: req.user.id
    }
    if (value.device_id) {
        where = {
            id: value.device_id,
        }
    } else {
        where = {
            imei: value.imei,
        }
    }
    const device = await models.Device.findOne({
        where: where
    })

    if (!device) {
        return next({
            'status': 404,
            'message': 'Device Not Found',
        })
    }
    
    if (device.vehicle_id == null) {
        return next({
            'status': 400,
            'message': 'Device Not Paired',
        })
    }

    await device.update({
        vehicle_id: null
    })

    return res.status(200).json({
        'status': 200,
        'message': 'Device Unpaired Successfully',
        'response': device
    })
}

controllers.unPairVehicle = async (req, res, next) => {
    const schema = Joi.object({
        vehicle_id: Joi.string().uuid().optional(),
        plat_number: Joi.string().regex(/^[A-Z]{1,2}\s{0,1}[0-9]{1,4}\s{0,1}[A-Z]{1,3}$/).when('vehicle_id', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required()
        }),
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
    let where = {
        user_id: req.user.id,
    }
    if (value.vehicle_id) {
        where = {
            id: value.vehicle_id,
        }
    } else {
        where = {
            plat_number: value.plat_number,
        }
    }

    var vehicle = await models.Vehicle.findOne({
        where: where,
        include: {
            model: models.Device,
            as: 'devices'
        }
    })

    if (!vehicle) {
        return next({
            'status': 404,
            'message': 'Vehicle Not Found',
        })
    }

    if (!vehicle.devices.length) {
        return next({
            'status': 400,
            'message': 'Vehicle does not have paired device',
        })
    }

    const devices = vehicle.devices
    for (const device of devices) {
        await device.update({
            vehicle_id: null
        })
    }

    await vehicle.reload()

    return res.status(200).json({
        'status': 200,
        'message': 'Device and Vehicle Unpaired Successfully',
        'response': vehicle
    })
}

export default controllers