import { personModel, userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { StatusCodes } from 'http-status-codes';
import express from 'express';
import { ObjectId } from 'mongodb';

const createVehicle = async (licenePlate, type) => {
  const data = {
    licenePlate : licenePlate,
    type : type,
  }
  // eslint-disable-next-line no-useless-catch
  try {
    const createNew = await vehicleModel.createNew(data)
    if (createNew.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
    }
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const isActive = async (licenePlate, idUser) => {
  // const data = {
  //   licenePlate : licenePlate,
  //   type : type,
  // }
  // eslint-disable-next-line no-useless-catch
  try {
    const vehicle = await vehicleModel.findOneByLicenePlate(licenePlate)
    if(vehicle.driverId != null){
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã có chủ', 'Not Deleted', 'BR_vihicle_4');
    }
    const driver = await personModel.findByID(idUser)
    if(driver.driver.arrayvehicleId.some(id => id.equals(new ObjectId(vehicle._id))) == false){
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Chủ xe không có xe này', 'Not Deleted', 'BR_vihicle_4');
    }
    const isActive = await vehicleModel.isActive(licenePlate, idUser)
    if (isActive.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
    }
    return isActive;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const inActive = async (licenePlate) => {
  // const data = {
  //   licenePlate : licenePlate,
  //   type : type,
  // }
  // eslint-disable-next-line no-useless-catch
  try {
    // const vehicle = await vehicleModel.findOneByLicenePlate(licenePlate)
    const inActive = await vehicleModel.inActive(licenePlate)
    if (inActive.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe tạo không thành công', 'Not Deleted', 'BR_vihicle_4');
    }
    return inActive;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const vehicleService = {
  createVehicle,
  isActive,
  inActive,
};