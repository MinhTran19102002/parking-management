import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';


const SCHEDULE_COLLECTION_NAME = 'schedule';
const SCHEDULE_COLLECTION_SCHEMA = Joi.object({
    day: Joi.string().required().min(1).max(50).trim().strict(),
    startTime: Joi.date().timestamp('javascript').default(null).strict(),
    endTime: Joi.date().timestamp('javascript').default(null).strict(),
    staffId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    stationId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    //   eventId: Joi.string().optional().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    createdAt: Joi.date().timestamp('javascript').default(null).strict(),
    _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
    return await SCHEDULE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createSchedule = async (data) => {
    try {
        if (data.staffId) {
            data.staffId = data.staffId.toString();
        }
        if (data.stationId) {
            data.stationId = data.stationId.toString();
        }
        const validateData = await validateBeforCreate(data);
        if (data.staffId) {
            validateData.staffId = new ObjectId(validateData.staffId);
        }
        if (data.stationId) {
            validateData.stationId = new ObjectId(validateData.stationId);
        }
        validateData.createdAt = data.createdAt;
        const createNew = await GET_DB().collection(SCHEDULE_COLLECTION_NAME).insertOne(validateData);
        return createNew;
    } catch (error) {
        throw new Error(error);
    }
};

export const scheduleModel = {
    SCHEDULE_COLLECTION_NAME,
    SCHEDULE_COLLECTION_SCHEMA,
    createSchedule,
};
