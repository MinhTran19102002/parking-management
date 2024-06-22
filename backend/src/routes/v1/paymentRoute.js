import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.route('/momo')   // 
  .post(paymentController.payment)

Router.route('/register')   // 
  .post(paymentController.register)

export const paymentRoute = Router