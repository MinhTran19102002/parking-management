import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from '~/models/parkingModel';
import { StatusCodes } from 'http-status-codes';
import { vehicleModel } from './vehicleModel';
import { personModel } from './personModel';
import { paymentModel } from './paymentModel';

const PARKINGTURN_COLLECTION_NAME = 'parkingTurn';
const PARKINGTURN_COLLECTION_SCHEMA = Joi.object({
  vehicleId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  parkingId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  position: Joi.string().max(6).trim().strict().optional(),
  image: Joi.string(),
  fee: Joi.number().integer().multiple(1000).required().min(1000),
  start: Joi.date().timestamp('javascript').default(null),
  end: Joi.date().timestamp('javascript').default(null),

  _destroy: Joi.boolean().default(false),
});

const validateBeforOperate = async (data) => {
  return await PARKINGTURN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    console.log(data)
    const validateData = await validateBeforOperate(data);
    validateData.start = data.start
    validateData.vehicleId = new ObjectId(validateData.vehicleId);
    validateData.parkingId = new ObjectId(validateData.parkingId);
    const checkPosition = await findPosition(validateData);
    if (checkPosition == null) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Vị trí đã có xe', 'Error', 'BR_vihicle_5');
    }
    const checkvehicleId = await findvehicleId(validateData);
    if (checkvehicleId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi', 'Error', 'BR_vihicle_5');
    }
    const createNew = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .insertOne(validateData);
    if (createNew.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lượt đỗ tạo không thành công', 'Not Created', 'BR_parkingTurn_2');
    }
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(validateData.parkingId), 'slots.position': validateData.position },
        {
          $inc: { occupied: 1 },
          $set: {
            'slots.$.parkingTurnId': createNew.insertedId,
            'slots.$.isBlank': false,
          },
        },
      );
    if (update.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
    }
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createNewV2 = async (data) => {
  try {
    const validateData = await validateBeforOperate(data);
    validateData.start = data.start
    validateData.vehicleId = new ObjectId(validateData.vehicleId);
    validateData.parkingId = new ObjectId(validateData.parkingId);
    const checkvehicleId = await findvehicleId(validateData);
    if (checkvehicleId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe đã ở trong bãi', 'Error', 'BR_vihicle_5');
    }
    const createNew = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .insertOne(validateData);
    if (createNew.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lượt đỗ tạo không thành công', 'Not Created', 'BR_parkingTurn_2');
    }
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(validateData.parkingId) },
        {
          $addToSet: {
            slots: createNew.insertedId,
          },
        },
      );
    if (update.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
    }
    return createNew;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateOut = async (filter, now) => {
  try {
    const timeOut = now;
    const find = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne(filter);
    let fee
    if (find) {
      fee = find.fee
      const dateIn = new Date(find.start);
      const dateOut = new Date(timeOut);
      const timeDifference = dateOut - dateIn;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      if (hoursDifference > 10) {
        fee = fee + Math.floor(hoursDifference / 10) * 10000
      }
    }
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe không ở trong bãi', 'Error', 'BR_vihicle_5_1');
    }
    const updateOut = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .findOneAndUpdate(filter, { $set: { end: timeOut, _destroy: true, fee: fee } });
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(updateOut.parkingId), 'slots.position': updateOut.position },
        {
          $inc: { occupied: -1 },
          $set: {
            'slots.$.parkingTurnId': null,
            'slots.$.isBlank': true,
          },
        },
      );
    if (update.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
    }
    return updateOut;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const carOutHollow = async (zone, parkingTurnid) => {
  const update = await GET_DB()
    .collection(parkingModel.PARKING_COLLECTION_NAME)
    .updateOne(
      { zone: zone },
      {
        $pull: { slots: new ObjectId(parkingTurnid) }
      },
    );
  return update
}

const carInHollow = async (zone, parkingTurnid) => {
  const update = await GET_DB()
    .collection(parkingModel.PARKING_COLLECTION_NAME)
    .updateOne(
      { zone: zone },
      {
        $addToSet: { slots: new ObjectId(parkingTurnid) }
      },
    );
  return update
}

const updateOutV2 = async (filter, now, licenePlate) => {
  try {
    const timeOut = now;
    const find = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne(filter);
    let fee
    if (find) {
      fee = find.fee
      const dateIn = new Date(find.start);
      const dateOut = new Date(timeOut);
      const timeDifference = dateOut - dateIn;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      if (hoursDifference > 10) {
        fee = fee + Math.floor(hoursDifference / 10) * 10000
      }
    }
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe không ở trong bãi', 'Error', 'BR_vihicle_5_1');
    }
    const arrayPayment = await paymentModel.findByLicenePlate(licenePlate, find.start, timeOut)
    console.log(arrayPayment)
    if (Array.isArray(arrayPayment) && arrayPayment.length > 0) {
      fee = 0
    }
    const updateOut = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .findOneAndUpdate(filter, { $set: { end: timeOut, _destroy: true, fee: fee } });
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { zone: 'O' },
        {
          $pull: { slots: new ObjectId(updateOut._id) }
        },
      );
    if (update.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
    }
    return updateOut;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const findvehicleId = async (data) => {
  try {
    const findvehicleId = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .findOne({ vehicleId: new ObjectId(data.vehicleId), _destroy: false }); // KẾt quả trả về là xe nằm trong bãi
    return findvehicleId;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findPosition = async (data) => {
  try {
    // const findPosition = await GET_DB().collection(PARKINGTURN_COLLECTION_NAME).findOne({ 'parkingId' : data.parkingId, 'position' : data.position, '_destroy' : false })
    console.log(data)
    const findPosition = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(data.parkingId),
        slots: {
          $elemMatch: {
            position: data.position,
            isBlank: true,
          },
        },
      });
    return findPosition;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getVehicleInOutNumber = async (startDate, endDate) => {
  try {
    let start1 = Date.parse(parseDate(startDate))
    let end1 = Date.parse(parseDate(endDate))
    const start = Date.parse(parseDate(startDate)) - 7 * 60 * 60 * 1000;
    const end = Date.parse(parseDate(endDate)) - 7 * 60 * 60 * 1000;
    console.log(parseDate(startDate).getTimezoneOffset() + '         ' + parseDate(endDate).setUTCHours(7))
    console.log(start + '         ' + end)
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start1,
              $lte: end1,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              day: { $dayOfMonth: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },

              // year: { $year: { $toDate: '$start' } },
              // month: { $month:{ $toDate: '$start' } },
              // day: { $dayOfMonth: { $toDate: '$start' } },
              zone: { $substr: ["$position", 0, 1] },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
            data: {
              $push: {
                k: '$_id.zone',
                v: '$count',
              },
            },
            total: { $sum: '$count' },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%d/%m/%Y',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                  },
                },
              },
            },
            data: { $arrayToObject: '$data' },
            total: 1,
          },
        },
        {
          $sort: {
            total: -1 // Sắp xếp giảm dần theo 'value'
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getVehicleInOutNumberByHour = async (startDate, endDate) => {
  try {
    let start1 = Date.parse(parseDate(startDate))
    let end1 = Date.parse(parseDate(endDate))

    const start = Date.parse(parseDate(startDate)) - 7 * 60 * 60 * 1000;
    const end = Date.parse(parseDate(endDate)) - 7 * 60 * 60 * 1000;
    // console.log(parseDate(startDate).getTimezoneOffset() + '         ' + parseDate(endDate).setUTCHours(7))
    // console.log(start + '         ' + end)
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start1,
              $lte: end1,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $group: {
            _id: {
              // year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              // month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              // day: { $dayOfMonth: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              hour: { $hour: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              zone: { $substr: ["$position", 0, 1] },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              // year: '$_id.year',
              // month: '$_id.month',
              // day: '$_id.day',
              hour: '$_id.hour',
            },
            data: {
              $push: {
                k: '$_id.zone',
                v: '$count',
              },
            },
            total: { $sum: '$count' },
          },
        },
        {
          $project: {
            _id: 0,
            // hour: {
            //   $dateToString: {
            //     format: '%d/%m/%Y',
            //     date: {
            //       $dateFromParts: {
            //         year: '$_id.year',
            //         month: '$_id.month',
            //         day: '$_id.day',
            //       },
            //     },
            //   },
            // },
            hour: '$_id.hour',
            data: { $arrayToObject: '$data' },
            total: 1,
          },
        },
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getRevenue = async (startDate, endDate) => {
  try {

    let start1 = Date.parse(parseDate(startDate))
    let end1 = Date.parse(parseDate(endDate))
    const start = Date.parse(parseDate(startDate)) - 7 * 60 * 60 * 1000;
    const end = Date.parse(parseDate(endDate)) - 7 * 60 * 60 * 1000;
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start1,
              $lte: end1,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              day: { $dayOfMonth: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              zone: '$parking.zone',
            },
            totalFee: { $sum: '$fee' },
          },
        },
        {
          $group: {
            _id: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
            data: {
              $push: {
                k: '$_id.zone',
                v: '$totalFee',
              },
            },
            total: { $sum: '$totalFee' },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%d/%m/%Y',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                  },
                },
              },
            },
            data: { $arrayToObject: '$data' },
            total: 1,
          },
        },
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const GetRevenueByHour = async (startDate, endDate) => {
  try {

    let start1 = Date.parse(parseDate(startDate))
    let end1 = Date.parse(parseDate(endDate))
    const start = Date.parse(parseDate(startDate)) - 7 * 60 * 60 * 1000;
    const end = Date.parse(parseDate(endDate)) - 7 * 60 * 60 * 1000;
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start1,
              $lte: end1,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $group: {
            _id: {
              // year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              // month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              // day: { $dayOfMonth: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              hour: { $hour: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              zone: '$parking.zone',
            },
            totalFee: { $sum: '$fee' },
          },
        },
        {
          $group: {
            _id: {
              // year: '$_id.year',
              // month: '$_id.month',
              // day: '$_id.day',
              hour: '$_id.hour',
            },
            data: {
              $push: {
                k: '$_id.zone',
                v: '$totalFee',
              },
            },
            total: { $sum: '$totalFee' },
          },
        },
        {
          $project: {
            _id: 0,
            // date: {
            //   $dateToString: {
            //     format: '%d/%m/%Y',
            //     date: {
            //       $dateFromParts: {
            //         year: '$_id.year',
            //         month: '$_id.month',
            //         day: '$_id.day',
            //       },
            //     },
            //   },
            // },
            hour: '$_id.hour',
            data: { $arrayToObject: '$data' },
            total: 1,
          },
        },
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const general = async (start, end) => {
  try {
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $group: {
            _id: {
              zone: { $substr: ["$position", 0, 1] }
            },
            entries: { $sum: 1 },
            exists: {
              $sum: {
                $cond: [{ $ne: ["$end", null] }, 1, 0]
              }
            },
            fee: { $sum: '$fee' },
            averageDuration: {
              $avg: {
                $cond: [
                  { $ne: ["$start", null] },
                  {
                    $subtract: [
                      {
                        $cond: [
                          { $ne: ["$end", null] },
                          "$end",
                          { $toDate: "$$NOW" }
                        ]
                      },
                      "$start"
                    ]
                  },
                  null
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            zone: "$_id.zone",
            entries: "$entries",
            exists: "$exists",
            fee: "$fee",
            // averageDuration: {
            //   $dateToString: {
            //     format: '%d/%m/%Y',
            //     date: {
            //       $dateFromParts: {
            //         year: '$_id.year',
            //         month: '$_id.month',
            //         day: '$_id.day',
            //       },
            //     },
            //   },
            // },
            averageDuration: "$averageDuration"
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const visistorRate = async (start, end) => {
  try {
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },
        {
          $group: {
            _id: {
              driverIdNull: { $eq: ["$vehicle.driverId", null] }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            type: {
              $cond: {
                if: { $eq: ["$_id.driverIdNull", true] },
                then: "visitor",
                else: "driver"
              }
            },
            value: "$count"
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const inoutByTime = async (start, end, timeType) => {
  try {
    if (timeType == "date") {
      const getVehicleInOutNumber = await GET_DB()
        .collection(PARKINGTURN_COLLECTION_NAME)
        .aggregate([
          {
            $match: {
              start: {
                $gte: start,
                $lte: end,
              },
            },
          },

          {
            $addFields: {
              timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
                month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
                day: { $dayOfMonth: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateToString: {
                  format: '%d/%m/%Y',
                  date: {
                    $dateFromParts: {
                      year: '$_id.year',
                      month: '$_id.month',
                      day: '$_id.day',
                    },
                  },
                },
              },
              count: 1,
            },
          },
        ]);
      return await getVehicleInOutNumber.toArray();
    } else {
      const getVehicleInOutNumber = await GET_DB()
        .collection(PARKINGTURN_COLLECTION_NAME)
        .aggregate([
          {
            $match: {
              start: {
                $gte: start,
                $lte: end,
              },
            },
          },

          {
            $addFields: {
              timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
                month: { $month: { $subtract: [{ $toDate: '$start' }, '$timezoneOffset'] } },
              },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateToString: {
                  format: '%m/%Y',
                  date: {
                    $dateFromParts: {
                      year: '$_id.year',
                      month: '$_id.month'
                    },
                  },
                },
              },
              count: 1,
            },
          },
        ]);
      return await getVehicleInOutNumber.toArray();
    }
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const inoutByJob = async (start, end) => {
  try {
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },

        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'driver',
          },
        },
        {
          $unwind: '$driver',
        },
        {
          $group: {
            _id: {
              driverJob: "$driver.driver.job"
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            job: "$_id.driverJob",
            value: "$count"
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const inoutByDepa = async (start, end) => {
  try {
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },

        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'driver',
          },
        },
        {
          $unwind: '$driver',
        },
        {
          $group: {
            _id: {
              driverDepartment: "$driver.driver.department"
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            department: "$_id.driverDepartment",
            value: "$count"
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const mostParkedVehicle = async (start, end) => {
  try {
    const getVehicleInOutNumber = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            start: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },

        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'driver',
          },
        },
        {
          $unwind: '$driver',
        },
        {
          $group: {
            _id: {
              vehicle: "$vehicle",
              driver: "$driver"
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            vehicle: "$_id.vehicle",
            driver: "$_id.driver",
            turn: "$count"
          }
        },
        {
          $sort: {
            turn: -1 // Sắp xếp giảm dần theo 'value'
          }
        }
      ]);
    return await getVehicleInOutNumber.toArray();
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const parseDate = (str) => {
  const parts = str.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10); // Trừ 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null; // Trả về null nếu chuỗi không hợp lệ
};

const updateSlot = async (zone, position, parkingTurnId, isOut) => {
  try {
    let occupied
    if (isOut) {
      occupied = -1
    } else {
      occupied = 1
    }
    const update = await GET_DB()
      .collection(parkingModel.PARKING_COLLECTION_NAME)
      .updateOne(
        { zone: zone, 'slots.position': position },
        {
          $inc: { occupied: occupied },
          $set: {
            'slots.$.parkingTurnId': parkingTurnId,
            'slots.$.isBlank': isOut,
          },
        },
      );
    if (update.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Bãi cập nhật không thành công', 'Not Updated', 'BR_parking_3');
    }
    return update;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


const updateParkingTurn = async (parkingId, position, parkingTurnId) => {
  try {
    const update = await GET_DB()
      .collection(parkingTurnModel.PARKINGTURN_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(parkingTurnId) },
        {
          $set: {
            'position': position,
            'parkingId': new ObjectId(parkingId),
          },
        },
      );
    if (update.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Cap nhat luot dau khong thanh cong', 'Not Updated', 'BR_parking_3');
    }
    return updateOut;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


const findOneByLicenePlate = async (licenePlate) => {
  try {
    const findOneByLicenePlate = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'driver',
          },
        },
        {
          $match: {
            "driver.licenePlate": licenePlate,
            "end": null
          },
        },
      ]).toArray();
    return findOneByLicenePlate;
  } catch (error) {
    throw new Error(error);
  }
};


const findOneById = async (id) => {
  try {
    const findOneByLicenePlate = await GET_DB()
      .collection(PARKINGTURN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            "_id": new ObjectId(id)
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: '$vehicle',
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'driver',
          },
        },
        {
          $unwind: {
            path: '$driver',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]).toArray();
    return findOneByLicenePlate[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const parkingTurnModel = {
  PARKINGTURN_COLLECTION_NAME,
  PARKINGTURN_COLLECTION_SCHEMA,
  findOneByLicenePlate,
  createNew,
  updateOut,
  getVehicleInOutNumber,
  getVehicleInOutNumberByHour,
  getRevenue,
  GetRevenueByHour,
  createNewV2,
  updateOutV2,
  findPosition,
  updateSlot,
  carOutHollow,
  updateParkingTurn,
  carInHollow,
  visistorRate,
  inoutByTime,
  inoutByJob,
  inoutByDepa,
  mostParkedVehicle,
  general,
  findOneById,
};
