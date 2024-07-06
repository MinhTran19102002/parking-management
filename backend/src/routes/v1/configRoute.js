import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { configController } from '~/controllers/configController'

const Router = express.Router()


Router.route('/ConfigCamera')
  .put(configController.updateConfigCamera)
  .get(configController.findConfigCamera)



export const configRoute = Router