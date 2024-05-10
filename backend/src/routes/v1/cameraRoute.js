import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cameraController } from '~/controllers/cameraController'
// import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
// import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/')
  .get(cameraController.findByFilter)
  .post(cameraController.createCamera)
  .put(cameraController.updateCamera)
  .delete(cameraController.deleteCamera)

Router.route('/unused')
  .get(cameraController.findByFilterUnused)

  Router.route('/used')
  .get(cameraController.findByFilterUsed)

Router.route('/updateS')
  .post(cameraController.updateManyCamera)

Router.route('/deletes')
  .post(cameraController.deleteManyCamera)

Router.route('/checkCameraId')
  .get(cameraController.checkCameraId)


Router.route('/upload').get(cameraController.upload)

Router.route('/addImage').put(
  // verifyTokenMidleware.verifyTokenAndAdmin,
  cameraController.addImage
);

Router.route('/updateSlot').put(
  // verifyTokenMidleware.verifyTokenAndAdmin,
  cameraController.updateSlot
);


export const cameraRoute = Router