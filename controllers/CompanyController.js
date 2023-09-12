import Joi from 'joi';
import models from '../models/index.js'

const controllers = {};

controllers.index = async (req, res) => {
    var companies = await models.Company.findAll()
  
    res.json({
        'status': 200,
        'message': 'Success',
        'response': companies
    })
}

controllers.show = async (req, res) => {
    const { error } = Joi.object({
        id: Joi.string().uuid().required()
    }).validate(req.params)

    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': error.details[0].message,
            'response': null
        })
    }

    var company = await models.Company.findOne({
        where: {
            id: req.params.id
    }})

    return res.json({
        'status': 200,
        'message': 'Success',
        'response': company
    })
}

controllers.store = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': error.details[0].message,
            'response': null
        })
    }

    var company = await models.Company.create({
        name: value.name,
        owner_id: req.user.id,
        created_by: 'User',
        updated_by: 'User'
    })

    return res.json({
        'status': 200,
        'message': 'Success',
        'response': company
    })
}

controllers.update = async (req, res) => {
    let { error } = Joi.object({
        id: Joi.string().uuid().required()
    }).validate(req.params)

    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': error.details[0].message,
            'response': null
        })
    }

    const schema = Joi.object({
        name: Joi.string().required(),
    })

    const { error: validationError, value } = schema.validate(req.body)

    if (validationError) {
        return res.status(400).json({
            'status': 400,
            'message': validationError.details[0].message,
            'response': null
        })
    }

    var company = await models.Company.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })

    if (!company) {
        return res.status(400).json({
            'status': 400,
            'message': 'Company not found',
            'response': null
        })
    }

    company.name = value.name
    company.updated_by = 'User'
    company.updated_at = new Date()
    await company.save()

    return res.json({
        'status': 200,
        'message': 'Success',
        'response': company
    })
}

controllers.destroy = async (req, res) => {
    let { error } = Joi.object({
        id: Joi.string().uuid().required()
    }).validate(req.params)

    if (error) {
        return res.status(400).json({
            'status': 400,
            'message': error.details[0].message
        })
    }

    var company = await models.Company.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })

    if (!company) {
        return res.status(400).json({
            'status': 400,
            'message': 'Company not found'
        })
    }

    await company.destroy()

    return res.json({
        'status': 200,
        'message': 'Success'
    })
}

export default controllers