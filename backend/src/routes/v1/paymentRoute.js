import express from 'express'
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware'
import { paymentController } from '~/controllers/paymentController'

const Router = express.Router()

Router.route('/create_payment')   // dang ky xong roi thanh toan  
  .post(verifyTokenMidleware.verifyToken,paymentController.payment)

Router.route('/register')   //  dang ky 
  .post(verifyTokenMidleware.verifyToken,paymentController.register)

Router.route('/findById')   // 
  .get(verifyTokenMidleware.verifyToken,paymentController.findById)

Router.route('/findByfilter')   // 
  .get(verifyTokenMidleware.verifyToken,paymentController.findByfilter)

Router.route('/cancel')   // 
  .post(verifyTokenMidleware.verifyToken,paymentController.cancel)



Router.route('/save_payment')   // 
  .post(paymentController.save_payment)


Router.route('/send_mail')   // 
  .post(paymentController.send_mail)


export const paymentRoute = Router