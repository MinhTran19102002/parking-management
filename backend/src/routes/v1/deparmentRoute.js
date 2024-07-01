import express from 'express'
import { deparmentController } from '~/controllers/deparmentController'

const Router = express.Router()

Router.route('/createManyDeparment')
  .post(deparmentController.createManyDeparment)

Router.route('/')
  .get(deparmentController.findAll)

export const deparmentRoute = Router