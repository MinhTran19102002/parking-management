import express from 'express'
import {StatusCodes} from 'http-status-codes'
import {cameraController} from '~/controllers/cameraController'
// import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
// import {parkingValidation} from '~/validations/parkingValidation'

const Router = express.Router()

Router.route('/')
.get(cameraController.findByFilter)
  .post( cameraController.createCamera)
  .put( cameraController.updateCamara)


export const cameraRoute = Router