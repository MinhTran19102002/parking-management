import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cameraController } from '~/controllers/cameraController'
// import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
// import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/')
  .get(cameraController.findByFilter)
  .post(cameraController.createCamera)
  .put(cameraController.updateCamara)
  .delete(cameraController.deleteCamara)

Router.route('/unused')
  .get(cameraController.findByFilterUnused)

  Router.route('/used')
  .get(cameraController.findByFilterUsed)

Router.route('/updateS')
  .post(cameraController.updateManyCamara)

Router.route('/deletes')
  .post(cameraController.deleteManyCamara)

Router.route('/checkCameraId')
  .get(cameraController.checkCameraId)


Router.route('/upload').get(cameraController.upload)

export const cameraRoute = Router