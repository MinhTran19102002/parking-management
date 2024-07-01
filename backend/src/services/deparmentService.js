import { deparmentModel } from "~/models/deparmentModel";
import ApiError from "~/utils/ApiError";


const createMany = async (_data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        await Promise.allSettled(
            _data.map(async (data) => {
                const create = await deparmentModel.createNew(data);
                return create;
            }),
        )
            .then((results) => {
                results.forEach((result) => {
                    console.log(result);
                });
            })
            .catch((error) => {
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
            });
        return { message: 'Thành công' };
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};


const findAll = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const findAll = await deparmentModel.findAll();
      if (findAll.acknowledged == false) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          'Người lái xe không tồn tại',
          'Not Found',
          'BR_person_1_1',
        );
      }
      return findAll;
    } catch (error) {
      if (error.type && error.code)
        throw new ApiError(error.statusCode, error.message, error.type, error.code);
      else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }


export const deparmentService = {
    createMany,
    findAll,
}