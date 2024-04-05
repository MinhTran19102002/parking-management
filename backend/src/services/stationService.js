import { userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { ObjectId } from 'mongodb';
import { stationModel } from '~/models/stationModel';


const createNew = async (data) => {
    const zone = data.zone
    const findZone = await parkingModel.findOne(zone);
    // eslint-disable-next-line no-useless-catch
    try {
        const createNew = await stationModel.createStation({ stationName: data.stationName, zoneId: findZone._id, slotNumber: data.slotNumber })
        if (createNew.acknowledged == false) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
        }
        return createNew;
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

const findByZone = async (data) => {
    var _id = null
    if(data != "all"){
        const findZone = await parkingModel.findOne(data);
        _id = findZone._id
    }
    // eslint-disable-next-line no-useless-catch
    try {
        const createNew = await stationModel.findByZone(_id)
        if (createNew.acknowledged == false) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
        }
        return createNew;
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

export const stationService = {
    createNew,
    findByZone,
};