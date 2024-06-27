import Joi, { array, object } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { parkingModel } from '~/models/parkingModel';
import { StatusCodes } from 'http-status-codes';
import { vehicleModel } from './vehicleModel';

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
    throw new Error(error);
  }
};

export const paymentModel = {
  PAYMENT_COLLECTION_NAME,
  PAYMENT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  save_payment,
}