import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cameraController } from '~/controllers/cameraController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
// import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,cameraController.findByFilter)
  .post(verifyTokenMidleware.verifyTokenAndAdmin,cameraController.createCamera)
  .put(verifyTokenMidleware.verifyTokenAndAdmin,cameraController.updateCamera)
  .delete(verifyTokenMidleware.verifyTokenAndAdmin,cameraController.deleteCamera)

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
  verifyTokenMidleware.verifyTokenAndAdmin,
  cameraController.addImage
);

Router.route('/updateSlot').put(
  verifyTokenMidleware.verifyTokenAndAdmin,
  cameraController.updateSlot
);

Router.route('/setCameraAI').put(
  verifyTokenMidleware.verifyTokenAndAdmin,
  cameraController.setCameraAI
);

Router.route('/findCameraAIByType').get(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  cameraController.findCameraAIByType,
);


export const cameraRoute = Router