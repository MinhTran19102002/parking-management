import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

const STATION_COLLECTION_NAME = 'station';
const STATION_COLLECTION_SCHEMA = Joi.object({
  stationName: Joi.string().required().min(1).max(50).trim().strict(),
  zoneId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  //   stationId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  slotNumber : Joi.number().integer().required().min(0),
  createdAt: Joi.date().timestamp('javascript').default(Date.now).strict(),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await STATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createStation = async (data) => {
  try {
    if (data.zoneId) {
      data.zoneId = data.zoneId.toString();
    }
    const validateData = await validateBeforCreate(data);
    if (data.zoneId) {
      validateData.zoneId = new ObjectId(validateData.zoneId);
    }
    const createNew = await GET_DB().collection(STATION_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    throw new Error(error);
  }
};

const findByZone = async (id) => {
  try {
    var result;
    if (id) {
      id = new ObjectId(id);
      result = await GET_DB()
        .collection(STATION_COLLECTION_NAME)
        .find({zoneId: id}).toArray()
      console.log(result)
    } else {
      result = await GET_DB()
        .collection(STATION_COLLECTION_NAME)
        .find({}).toArray()
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};


export const stationModel = {
  STATION_COLLECTION_NAME,
  STATION_COLLECTION_SCHEMA,
  createStation,
  findByZone,
};
