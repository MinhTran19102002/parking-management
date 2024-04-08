import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {parkingTurnController} from '~/controllers/parkingTurnController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import { parkingTurnValidation } from '~/validations/parkingTurnValidation'

const Router = express.Router()

Router.route('/createPakingTurn')
  .post(parkingTurnValidation.create, verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.createNew)

Router.route('/createPakingTurnWithoutPosition')
  .post(parkingTurnValidation.createWithoutPosition, verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.createNewWithoutPosition)

Router.route('/createPakingTurnWithoutZoneAndPosition')
  .post(parkingTurnValidation.createWithoutZoneAndPosition,verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.createNewWithoutZone)

Router.route('/outPaking')
  .post(parkingTurnValidation.createWithoutZoneAndPosition,verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.outPaking)

Router.route('/Reports/GetVehicleInOutNumber')
  .get( parkingTurnController.getVehicleInOutNumber)

Router.route('/Reports/GetRevenue')
  .get(verifyTokenMidleware.verifyTokenAndManager,verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.getRevenue)

Router.route('/event')
  .get( parkingTurnController.getEvent)
  //verifyTokenMidleware.verifyTokenAndManager,verifyTokenMidleware.verifyTokenAndAdminManager,

Router.route('/event/export')
  .get(parkingTurnController.exportEvent)

export const parkingTurnRoute = Router