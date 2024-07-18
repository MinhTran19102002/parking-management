import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { parkingController } from '~/controllers/parkingController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import { parkingValidation } from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/getStatusByZone')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, parkingController.getStatusByZone) //verifyTokenMidleware.verifyToken,

Router.route('/createPaking')
  .post(parkingValidation.create, verifyTokenMidleware.verifyTokenAndAdminManager, parkingController.createPaking)

Router.route('/getStatus')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingController.getStatus) /// lay ra ban do xe do

Router.route('/getStatusByDriver')
  .get(verifyTokenMidleware.verifyToken,parkingController.getStatusByDriver) // lay ra thong tin cua ca nhan trong bai

Router.route('/updateSlot').put(
  verifyTokenMidleware.verifyTokenAndAdmin,
  parkingController.updateSlot
);



export const parkingRoute = Router