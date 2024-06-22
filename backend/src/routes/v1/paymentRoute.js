import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.route('/momo')   // 
  .post(paymentController.payment)

Router.route('/register')   // 
  .post(paymentController.register)

Router.route('/findById')   // 
  .get(paymentController.findById)

export const paymentRoute = Router