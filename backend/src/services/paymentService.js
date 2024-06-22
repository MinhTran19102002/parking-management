import { paymentModel } from "~/models/paymentModel";
import ApiError from '~/utils/ApiError';
import moment from 'moment';
import { StatusCodes } from 'http-status-codes'

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
        startDay= startDay.getTime();
        endDay = endDay.getTime();
        console.log(endDay)
        // return endDay
        const register = await paymentModel.createNew({startDay, endDay, licenePlate, fee});
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

export const paymentService = {
    register,
    findById,
}