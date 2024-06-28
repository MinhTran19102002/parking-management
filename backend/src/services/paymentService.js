import { paymentModel } from "~/models/paymentModel";
import ApiError from '~/utils/ApiError';
import moment from 'moment';
import { StatusCodes } from 'http-status-codes'
import nodemailer from 'nodemailer'
import { personModel } from "~/models/personModel";

const register = async (data) => {
    const feePerMonth = 1000000 // 1 trieu

    try {
        let timeStamp = data.startDay;
        let months = data.months;
        let licenePlate = data.licenePlate;
        let fee = feePerMonth * months
        let startDay = new Date(timeStamp)
        let endDay = new Date(startDay);
        endDay.setMonth(startDay.getMonth() + months);
        startDay = startDay.getTime();
        endDay = endDay.getTime();
        console.log(endDay)
        // return endDay
        const register = await paymentModel.createNew({ startDay, endDay, licenePlate, fee });
        if (register.acknowledged == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Dang ky khong thanh cong',
                'Not Success',
                'BR_parkingTurn_5',
            );
        }
        return register
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const findById = async (data) => {

    try {
        let _id = data.paymentId;

        const findById = await paymentModel.findOneById(_id);
        if (findById.acknowledged == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Dang ky khong thanh cong',
                'Not Success',
                'BR_parkingTurn_5',
            );
        }
        return findById
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};


const save_payment = async (data) => {

    try {
        let _id = data.paymentId;
        const save_payment = await paymentModel.save_payment(_id);
        if (save_payment.acknowledged == false) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Dang ky khong thanh cong',
                'Not Success',
                'BR_parkingTurn_5',
            );
        }

        const driver  = await personModel.findDriverByLicenePlate(save_payment.licenePlate)
        await send_mail(driver.email, save_payment.licenePlate, save_payment.fee, save_payment.startDay, save_payment.endDay)
        return save_payment
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const payment = async (req) => {
    try {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const paymentObj = await paymentModel.findOneById(req.body.paymentId);
        

        var tmnCode = "1V2OCED5"
        var secretKey = "BXTYJFU2KGJE3BZ53DJGVQZUT0BDFYJU"
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

        var createDate = moment().clone().format('yyyyMMDDHHmmss')
        var orderId =moment().clone().format('HHmmss');
        var amount = paymentObj.fee;
        var returnUrl = 'http://localhost:5173/payment-success'

        var orderInfo = "Thanh toán phí dữ xe"; // thong tin thanh toan
        var locale = "vn";
        locale = 'vn';
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = 'orderType';
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params = sortObject(vnp_Params);
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log(vnpUrl)
        return vnpUrl
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const send_mail = async (email, licenePlate, fee,startDay, endDay) => {

    try {

        let start = moment(startDay).format('DD/MM/YYYY hh:ss:mm');
        let end = moment(endDay).format('DD/MM/YYYY hh:ss:mm');
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            service: "Gmail",
            auth: {
              user: "minhqd192002@gmail.com",
              pass: "xjdj dwox zaxj etft",
            },
          });
          let html = "<h1>Cảm ơn bạn đã đăng ký thành viên</h1><h2>Thông tin đăng ký</h2><ul><li>Biển số xe: " + licenePlate
           +"</li>  <li>Số tiền đã thanh toán: "+ fee
           +"</li> <li>Thời gian: "+ start + " - " + end
           +" </li></ul>"
          const message = {
            from: "Admin Parking Management",
            to: email,
            subject: "Thanh toán thành công ",
            html: html 
          }
          const result = await transporter.sendMail(message)
          console.log(result)
          return result
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

export const paymentService = {
    register,
    findById,
    payment,
    save_payment,
    send_mail,
}