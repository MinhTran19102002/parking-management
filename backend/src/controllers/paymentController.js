import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { url } from 'inspector';
import { paymentService } from '~/services/paymentService';
import moment from 'moment';


const payment = async (req, res, next) => {
    try { 
        const vnpUrl = await paymentService.payment(req);
        res.status(StatusCodes.CREATED).json(vnpUrl);
    } catch (error) {
        next(error);
    }
};


const register = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const register = await paymentService.register(req.body);
        res.status(StatusCodes.CREATED).json(register);
    } catch (error) {
        next(error);
    }
}

const findById = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const register = await paymentService.findById(req.query);
        res.status(StatusCodes.CREATED).json(register);
    } catch (error) {
        next(error);
    }
}

const save_payment = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const save_payment = await paymentService.save_payment(req.body);
        server.io.emit('notification-parking',{ message:  'Thanh toan don hang'})
        res.status(StatusCodes.CREATED).json(save_payment);
    } catch (error) {
        next(error);
    }
}

const send_mail = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const send_mail = await paymentService.send_mail(req.body.gmail);
        res.status(StatusCodes.CREATED).json(send_mail);
    } catch (error) {
        next(error);
    }
}


const findByfilter = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const findByfilter = await paymentService.findByfilter(req.query);
        res.status(StatusCodes.CREATED).json(findByfilter);
    } catch (error) {
        next(error);
    }
}

const cancel = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const cancel = await paymentService.cancel(req.body.paymentId);
        res.status(StatusCodes.CREATED).json(cancel);
    } catch (error) {
        next(error);
    }
}

export const paymentController = {
    payment,
    register,
    findById,
    save_payment,
    send_mail,
    findByfilter,
    cancel,
}