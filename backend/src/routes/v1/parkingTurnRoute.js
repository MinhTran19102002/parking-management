import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { parkingTurnController } from '~/controllers/parkingTurnController'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import { parkingTurnValidation } from '~/validations/parkingTurnValidation'

const Router = express.Router()

// Router.route('/createPakingTurn')
//   .post(parkingTurnValidation.create, verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.createNew)

// Router.route('/createPakingTurnWithoutPosition')
//   .post(parkingTurnValidation.createWithoutPosition, verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.createNewWithoutPosition)

// Router.route('/createPakingTurnWithoutZoneAndPosition')
//   .post(parkingTurnValidation.createWithoutZoneAndPosition,verifyTokenMidleware.verifyTokenAndAdminManager, parkingTurnController.createNewWithoutZone)

Router.route('/createPakingTurn')
  .post(parkingTurnController.createNew)

Router.route('/createPakingTurnWithoutPosition')
  .post(parkingTurnController.createNewWithoutPosition)

Router.route('/createPakingTurnWithoutZoneAndPosition')
  .post(parkingTurnController.createNewZone)

// Router.route('/createPakingOrOut')
//   .post(parkingTurnController.createPakingOrOut)


Router.route('/outPaking')
  .post(parkingTurnController.outPaking)

Router.route('/Reports/GetVehicleInOutNumber')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.getVehicleInOutNumber)

Router.route('/Reports/GetVehicleInOutNumberByHour')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.getVehicleInOutNumberByHour)

Router.route('/Reports/GetRevenue')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.getRevenue)


Router.route('/Reports/GetRevenueByHour')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.GetRevenueByHour)

Router.route('/event')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.getEvent)
//verifyTokenMidleware.verifyTokenAndManager,verifyTokenMidleware.verifyTokenAndAdminManager,

Router.route('/event/export')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager,parkingTurnController.exportEvent)

Router.route('/event/getByDriver')
  .get(verifyTokenMidleware.verifyToken,parkingTurnController.getByDriver)


Router.route('/carInSlot')
  .post(parkingTurnController.carInSlot)

Router.route('/carOutSlot')
  .post(parkingTurnController.carOutSlot)



Router.route('/event/getByFilter')   // 
  .get(parkingTurnController.getByFilter)

  Router.route('/Reports/general')
  .get(parkingTurnController.general)

Router.route('/Reports/visistorRate')
  .get(parkingTurnController.visistorRate)

  Router.route('/Reports/inoutByTime')
  .get(parkingTurnController.inoutByTime)


  Router.route('/Reports/inoutByJob')
  .get(parkingTurnController.inoutByJob)

  Router.route('/Reports/inoutByDepa')
  .get(parkingTurnController.inoutByDepa)

  Router.route('/Reports/mostParkedVehicle')
  .get(parkingTurnController.mostParkedVehicle)
  
  Router.route('/Reports/exportReport')
  .get(parkingTurnController.exportReport)

export const parkingTurnRoute = Router