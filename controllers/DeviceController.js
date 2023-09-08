import models from '../models/index.js'

const controllers = {};

controllers.index = async (req, res) => {
    var devices = await models.Device.findAll()
  
    res.json({
        'status': 200,
        'message': 'Success',
        'response': devices
    })
}

export default controllers