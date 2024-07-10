import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from './parkingModel';
import { parkingTurnModel } from './parkingTurnModel';
import { vehicleModel } from './vehicleModel';
import { personModel } from './personModel';
import { parkingTurnService } from '~/services/parkingTurnService';

const EVENT_COLLECTION_NAME = 'event';
const EVENT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(50).trim().strict(),
  zone: Joi.string().optional().min(1).max(2).trim().strict(),
  position: Joi.string().max(6).trim().strict().optional(),
  eventId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await EVENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createEvent = async (data) => {
  try {
    if (data.eventId) {
      data.eventId = data.eventId.toString();
    }
    console.log(data)
    const validateData = await validateBeforCreate(data);
    if (data.eventId) {
      validateData.eventId = new ObjectId(validateData.eventId);
    }
    validateData.createdAt = data.createdAt;
    const createNew = await GET_DB().collection(EVENT_COLLECTION_NAME).insertOne(validateData);
    if (createNew.acknowledged == true) {
      let message
      let type
      if (validateData.name == "parking_full") {
        message = "Thông báo khẩn cấp!\nKhu vực đầy: " + validateData.zone
        type = "urgent"
      }
      if (validateData.name == "almost_full") {
        message = "Thông báo khẩn cấp!\nKhu vực sắp đầy: " + validateData.zone
        type = "urgent"
      }
      if (validateData.name == "in") {
        const parkingTurn = await parkingTurnModel.findOneById(validateData.eventId)
        console.log(parkingTurn)
        message = "Thông báo!\nXe vào bãi đỗ: " + parkingTurn.vehicle.licenePlate
        type = "nomal"
      }
      if (validateData.name == "out") {
        const parkingTurn = await parkingTurnModel.findOneById(validateData.eventId)
        console.log(parkingTurn)
        message = "Thông báo!\nXe ra bãi đỗ: " + parkingTurn.vehicle.licenePlate
        type = "nomal"
      }
      if (validateData.name == "inSlot") {
        const parkingTurn = await parkingTurnModel.findOneById(validateData.eventId)
        message = "Thông báo!\nXe vào ô đỗ: " + parkingTurn.vehicle.licenePlate + "\nVị trí: " + validateData.position
        type = "nomal"
      }
      if (validateData.name == "outSlot") {
        const parkingTurn = await parkingTurnModel.findOneById(validateData.eventId)
        message = "Thông báo!\nXe ra ô đỗ: " + parkingTurn.vehicle.licenePlate + "\nVị trí: " + validateData.position
        type = "nomal"
      }
      await parkingTurnService.sendMessageTelegram(message, type)
    }
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const findEvent = async ({ pageSize, pageIndex, startTime, endTime, ...params }, startDay, endDay) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};


  for (let [key, value] of Object.entries(params)) {
    let regex;
    if (key == 'licenePlate') {
      key = 'vehicle.' + key; //driver.vehicle.licenePlateq
    }
    if (key == 'position') {
      key = 'parkingTurn.' + key; //driver.vehicle.licenePlate
    }
    if (key == 'personName') {
      key = 'person.' + 'name'; //driver.vehicle.licenePlate
    }
    if (key == 'person.name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    }
    else if (key !== 'startDay' && key !== 'endDay') {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }

    Object.assign(paramMatch, regex);
  }
  try {
    console.log(paramMatch)
    let pipeline = {};
    let pipelineDay = {};

    if (startTime !== undefined && endTime !== undefined) {
      const startHour = parseInt(startTime, 10); // Chuyển đổi từ chuỗi sang số
      const endHour = parseInt(endTime, 10);
      pipeline = {
        time: {
          $gte: startHour,
          $lt: endHour,
        },
      }
    }
    if (startDay !== undefined && endDay !== undefined) {
      console.log(Date.parse(parseDate(startDay)))
      const start = Date.parse(parseDate(startDay)) + 7 * 60 * 60 * 1000;
      const end = Date.parse(parseDate(endDay)) + 7 * 60 * 60 * 1000;
      pipelineDay = {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }
    }
    console.log(pipelineDay)
    const event = await GET_DB()
      .collection(EVENT_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $match: {
            ...pipelineDay,
          },
        },
        {
          $addFields: {
            timezoneOffset: { $literal: new Date().getTimezoneOffset() * 60 * 1000 },
          },
        },
        {
          $addFields: {
            time: { $hour: { $subtract: [{ $toDate: '$createdAt' }, '$timezoneOffset'] } },
          },
        },
        {
          $match: {
            ...pipeline,
          },
        },

        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'eventId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        {
          $unwind: {
            path: '$parkingTurn',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'parkingTurn.vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        {
          $unwind: {
            path: '$vehicle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'person',
          },
        },
        {
          $unwind: {
            path: '$person',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            person: {
              $ifNull: ['$person', null],
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingTurn.parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: {
            path: '$parking',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            ...paramMatch,
          },
        },
        // {
        //   $addFields: {
        //     date: { $toDate: "$createAt" }
        //   }
        // },



        {
          $project: {
            _id: 0,
            name: 1,
            createdAt: 1,
            time: 1,
            // zone: '$parking.zone',
            zone: {
              $ifNull: ['$parking.zone', '$zone'],
            },
            parkingTurn: {
              position: '$parkingTurn.position',
              image: '$parkingTurn.image',
              fee: '$parkingTurn.fee',
              start: '$parkingTurn.start',
              end: '$parkingTurn.end',
            },

            vehicle: {
              licenePlate: '$vehicle.licenePlate',
              type: '$vehicle.type',
              driverId: '$vehicle.driverId',
            },
            person: 1,
          },
        },
      ])
      .toArray();

    if (event.person) {
      delete event.person.driver;
      delete event.person.createdAt;
      delete event.person.updatedAt;
      delete event.person._destroy;
    }
    let totalCount = event.length;
    let totalPage = 1;
    let newEvent = event;


    // console.log(pageSize)
    if (pageSize && pageIndex) {
      totalPage = Math.ceil(totalCount / pageSize);
      newEvent = newEvent.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newEvent,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
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

const getByDriver = async (phone) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  try {
    const event = await GET_DB()
      .collection(EVENT_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'eventId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        // {
        //   $unwind: '$parkingTurn',
        // },
        {
          $unwind: {
            path: '$parkingTurn',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'parkingTurn.vehicleId',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        // {
        //   $unwind: '$vehicle',
        // },
        {
          $unwind: {
            path: '$vehicle',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: personModel.PERSON_COLLECTION_NAME,
            localField: 'vehicle.driverId',
            foreignField: '_id',
            as: 'person',
          },
        },
        {
          $unwind: {
            path: '$person',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            person: {
              $ifNull: ['$person', null],
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingTurn.parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        // {
        //   $unwind: '$parking',
        // },
        {
          $unwind: {
            path: '$parking',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            createdAt: 1,
            // zone: '$parking.zone',
            zone: {
              $ifNull: ['$parking.zone', '$zone'],
            },
            parkingTurn: {
              position: '$parkingTurn.position',
              image: '$parkingTurn.image',
              fee: '$parkingTurn.fee',
              start: '$parkingTurn.start',
              end: '$parkingTurn.end',
            },

            vehicle: {
              licenePlate: '$vehicle.licenePlate',
              type: '$vehicle.type',
              driverId: '$vehicle.driverId',
            },
            person: 1,
          },
        },
        {
          $match: {
            'person.phone': phone,
          },
        },
      ])
      .toArray();
    if (event.person) {
      delete event.person.driver;
      delete event.person.createdAt;
      delete event.person.updatedAt;
      delete event.person._destroy;
    }
    return event;
  } catch (error) {
    throw new Error(error);
  }
};



const exportEvent = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  try {
    const event = await GET_DB()
      .collection(EVENT_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $lookup: {
            from: parkingTurnModel.PARKINGTURN_COLLECTION_NAME,
            localField: 'eventId',
            foreignField: '_id',
            as: 'parkingTurn',
          },
        },
        {
          $unwind: '$parkingTurn',
        },
        {
          $lookup: {
            from: vehicleModel.VEHICLE_COLLECTION_NAME,
            localField: 'parkingTurn.vehicleId',
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
            as: 'person',
          },
        },
        {
          $unwind: {
            path: '$person',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            person: {
              $ifNull: ['$person', null],
            },
          },
        },
        {
          $lookup: {
            from: parkingModel.PARKING_COLLECTION_NAME,
            localField: 'parkingTurn.parkingId',
            foreignField: '_id',
            as: 'parking',
          },
        },
        {
          $unwind: '$parking',
        },
        {
          $project: {
            _id: 0,
            name: 1,
            createdAt: 1,
            zone: '$parking.zone',
            parkingTurn: {
              position: '$parkingTurn.position',
              fee: '$parkingTurn.fee',
              start: '$parkingTurn.start',
              end: '$parkingTurn.end',
            },

            vehicle: {
              licenePlate: '$vehicle.licenePlate',
              type: '$vehicle.type',
              driverId: '$vehicle.driverId',
            },
            person: 1,
          },
        },
      ])
      .toArray();
    if (event.person) {
      delete event.person.driver;
      delete event.person.createdAt;
      delete event.person.updatedAt;
      delete event.person._destroy;
    }
    let totalCount = event.length;
    let totalPage = 1;
    let newEvent = event;

    if (pageSize && pageIndex) {
      totalPage = Math.ceil(totalCount / pageSize);
      newEvent = newEvent.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newEvent,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const eventModel = {
  EVENT_COLLECTION_NAME,
  EVENT_COLLECTION_SCHEMA,
  createEvent,
  findEvent,
  exportEvent,
  getByDriver,
};
