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

export default controllers