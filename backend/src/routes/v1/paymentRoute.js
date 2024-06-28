import express from 'express'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.route('/create_payment')   // 
  .post(paymentController.payment)

Router.route('/register')   // 
  .post(paymentController.register)

Router.route('/findById')   // 
  .get(paymentController.findById)

Router.route('/findByfilter')   // 
  .get(paymentController.findByfilter)

// Router.route('/findByfilter')   // 
//   .post(paymentController.findByfilter)



Router.route('/save_payment')   // 
  .post(paymentController.save_payment)


Router.route('/send_mail')   // 
  .post(paymentController.send_mail)


export const paymentRoute = Router