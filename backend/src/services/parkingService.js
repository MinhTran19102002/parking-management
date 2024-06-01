import { userModel } from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import { parkingModel } from '~/models/parkingModel'
import { StatusCodes } from 'http-status-codes'

const getStatusByZone = async (zone) => {
  const findOnde = await parkingModel.findOne(zone)
  if (!findOnde) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1')
  }
  return { zone: findOnde.zone, total: findOnde.total, occupied: findOnde.occupied, unoccupied: findOnde.total - findOnde.occupied }
}

const getStatus = async (zone) => {
  const getStatus = await parkingModel.getStatus(zone)
  if (!getStatus) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1')
  }
  return getStatus
}


const getStatusByDriver = async (zone, phone) => {
  let parkingMap = await parkingModel.getStatus(zone)

  parkingMap.forEach((item, indexParking) => {

    parkingMap[indexParking].slots.forEach((item, index) => {
      if (item.parkingTurn.persons == null || item.parkingTurn.persons.phone != phone) {
        parkingMap[indexParking].slots[index].parkingTurn = null
        // parkingMap.slots[index].persons = null 
      }
    });
  });




  if (!parkingMap) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1')
  }
  return parkingMap
}


const createPaking = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createPaking = await parkingModel.createNew(data)
    if (createPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi tạo không thành công', 'Not Created', 'BR_parking_2')
    }
    return createPaking
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const updateSlot = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {

    let { zone, position, ...dataUpadte } = data

    const updateSlot = await parkingModel.updateSlot(zone, position, dataUpadte)
    if (updateSlot.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi tạo không thành công', 'Not Created', 'BR_parking_2')
    }
    return updateSlot
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const parkingService = {
  getStatusByZone,
  createPaking,
  getStatus,
  updateSlot,
  getStatusByDriver,
}