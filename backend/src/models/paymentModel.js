import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from '~/models/parkingModel';
import { StatusCodes } from 'http-status-codes';
import { vehicleModel } from './vehicleModel';
import moment from 'moment';

const PAYMENT_COLLECTION_NAME = 'payment';
const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  //   driverId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  licenePlate: Joi.string().required().trim().strict().pattern(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/),
  fee: Joi.number().integer().multiple(1000).required().min(1000),
  startDay: Joi.date().timestamp('javascript').default(null),
  endDay: Joi.date().timestamp('javascript').default(null),
  isPay: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false),
});

const validateBeforOperate = async (data) => {
  return await PAYMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const vehicle = await vehicleModel.findOneByLicenePlate(data.licenePlate)
    if (!vehicle) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Xe khong ton tai trong du lieu', 'already exist', 'BR_zone_1');
    }
    const checkDay = await GET_DB().collection(PAYMENT_COLLECTION_NAME).findOne({ "licenePlate": data.licenePlate });

    if (checkDay) {
      if (checkDay.endDay > data.startDay)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Xe hien da dang ky nao ngay nay roi', 'already exist', 'BR_zone_1');
    }
    const validateData = await validateBeforOperate(data);
    validateData.startDay = data.startDay
    validateData.endDay = data.endDay
    const createNew = await GET_DB().collection(PAYMENT_COLLECTION_NAME).insertOne(validateData);
    // console.log(vehicle)
    const updateVehicle = await GET_DB().collection(vehicleModel.VEHICLE_COLLECTION_NAME).updateOne({ _id: new ObjectId(vehicle._id) }, { $set: { paymentId: new ObjectId(createNew.insertedId) } });
    return createNew;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    }
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};


const findOneById = async (_id) => {
  try {
    const id = new ObjectId(_id)
    const findOne = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .findOne({ _id: id });
    return findOne;
  } catch (error) {
    throw new Error(error);
  }
};

const save_payment = async (_id) => {
  try {
    const id = new ObjectId(_id)
    const findOneCheck = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .findOne({ _id: id, _destroy: true })
    if (findOneCheck) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Thanh toan da bi huy', 'already exist', 'BR_zone_1');
    }
    const findOne = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .findOneAndUpdate({ _id: id },
        {
          $set: {
            isPay: true
          }
        },
        { returnOriginal: false }
      );
    return findOne;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    }
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};


const cancel = async (_id) => {
  try {
    const id = new ObjectId(_id)
    const findOne = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .findOneAndUpdate({ _id: id },
        {
          $set: {
            _destroy: true
          }
        },
        { returnDocument: 'after' }
      );
    return findOne;
  } catch (error) {
    throw new Error(error);
  }
};

const findByfilter = async ({ pageSize, pageIndex, startDate, endDate, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (let [key, value] of Object.entries(params)) {
    // if (key == 'licenePlate') {
    //   key = 'driver.vehicle.' + key; //driver.vehicle.licenePlate
    // }
    let regex;
    if (key == 'isPay') {
      if (value == 'true') {
        regex = {
          [key]: true,
        };
      } else {
        regex = {
          [key]: false,
        };
      }
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }
  let pipelineDay = {}
  if (startDate !== undefined && endDate !== undefined) {
    let startDate1 = moment(startDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

    let endDate1 = moment(endDate, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');


    const start = Date.parse(parseDate(startDate1));
    const end = Date.parse(parseDate(endDate1)); //- 7 * 60 * 60 * 1000

    pipelineDay = {
        createdAt: {
          $gte: start,
          $lte: end,
        },
    }
  }
  try {
    const driver = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: pipelineDay,
        },
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        // {
        //   $lookup: {
        //     from: vehicleModel.VEHICLE_COLLECTION_NAME,
        //     localField: 'driver.arrayvehicleId',
        //     foreignField: '_id',
        //     as: 'driver.vehicle',
        //   },
        // },
        {
          $match: {
            ...paramMatch,
          },
        },
      ])
      .toArray();

    let totalCount = driver.length;
    let totalPage = 1;
    let newDriver = driver;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      // eslint-disable-next-line use-isnan
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      totalPage = Math.ceil(totalCount / pageSize);
      if (pageIndex > totalPage) pageIndex = totalPage;
      newDriver = newDriver.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newDriver,
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

export const paymentModel = {
  PAYMENT_COLLECTION_NAME,
  PAYMENT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  save_payment,
  findByfilter,
  cancel,
}