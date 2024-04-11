import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {cameraController} from '~/controllers/cameraController'
// import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
// import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/')
<<<<<<< HEAD
.get(cameraController.findByFilter)
  .post( cameraController.createCamera)
  .put( cameraController.updateCamara)

=======
  .get(cameraController.findByFilter)
  .post( cameraController.createCamera)
  .put( cameraController.updateCamara)
  .delete(cameraController.deleteCamara)

  Router.route('/deletes')
  .delete(cameraController.deleteManyCamara)

  Router.route('/checkCameraId')
  .get(cameraController.checkCameraId)
>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4

export const cameraRoute = Router