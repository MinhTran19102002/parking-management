import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/personService';
import bcrypt from 'bcrypt';
import {uploadImageHandler} from '~/utils/uploads';

const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createUserM(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createUserStaff = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service

    const  file= await uploadImageHandler.uploadImageSingle(req, res, 'avatar')
    let image = file.filename;
    const createUser = await userService.createUserStaff(req.body, image);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    req.query._id
    const  file= await uploadImageHandler.uploadImageSingle(req, res, 'avatar')
    let image = file.filename;
    const createUser = await userService.updateAvatar(req.query._id,  image);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const changePassword = await userService.changePassword(req, res);
    res.status(StatusCodes.CREATED).json(changePassword);
  } catch (error) {
    next(error);
  }
};

const createMany = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createMany = await userService.createMany(req.body);
    res.status(StatusCodes.CREATED).json(createMany);
  } catch (error) {
    next(error);
  }
};

const createManyDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createManyDriver = await userService.createManyDriver(req.body);
    res.status(StatusCodes.CREATED).json(createManyDriver);
  } catch (error) {
    next(error);
  }
};

const createDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createDriver = await userService.createDriver(req.body);

    res.status(StatusCodes.OK).json(createDriver);
  } catch (error) {
    next(error);
  }
};
const findDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const findDriver = await userService.findDriver();

    res.status(StatusCodes.OK).json(findDriver);
  } catch (error) {
    next(error);
  }
};

const findUsers = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const users = await userService.findUsers(req.query);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const findEmployees = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const users = await userService.findEmployees({ ...req.query });
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const findByID = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const { _id } = req.query;
    const users = await userService.findByID(_id);
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const newUser = req.body;
    delete newUser.account;
    const rs = await userService.updateUser(req.query._id, newUser);
    res.status(StatusCodes.CREATED).json(rs);
  } catch (error) {
    next(error);
  }
};


const deleteUser = async (req, res, next) => {
  try {
    const rs = await userService.deleteUser(req.query._id, 'Admin');
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};
const deleteManager = async (req, res, next) => {
  try {
    const rs = await userService.deleteUser(req.query._id, 'Manager');
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteStaff= async (req, res, next) => {
  try {
    const rs = await userService.deleteUser(req.query._id, 'Staff');
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteManagers = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const ids = req.body.ids;
    //const role = req.body.role;
    const rs = await userService.deleteMany(ids,'Manager' );
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteStaffs = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const ids = req.body.ids;
    // const role = req.body.role;
    const rs = await userService.deleteMany(ids,'Staff' );
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteEmployees = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await userService.deleteManyE(req.body);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};
const deleteAll = async (req, res, next) => {
  try {
    const rs = await userService.deleteAll();
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteMany = async (req, res, next) => {
  try {
    const rs = await userService.deleteMany(req.body);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const updateDriver = req.body;
    const rs = await userService.updateDriver(req.query._id, updateDriver);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const _idDelete = req.query._id;
    const rs = await userService.deleteDriver(_idDelete);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteDrivers = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const ids = req.body.ids;
    const rs = await userService.deleteDrivers(ids);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const findDriverByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await userService.findDriverByFilter(req.query);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const findStaffByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await userService.findStaffByFilter(req.query);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createEmployee(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const rs = await userService.updateEmployee(req.query._id, req.body);
    res.status(StatusCodes.CREATED).json(rs);
  } catch (error) {
    next(error);
  }
};

const createManyEmployee = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createUser = await userService.createManyEmployee(req.body);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const deleteAllEmployee = async (req, res, next) => {
  try {
    const rs = await userService.deleteAllEmployee();
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const findManagerByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await userService.findManagerByFilter(req.query);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};


const deleteEmployee = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const _idDelete = req.query._id;
    const rs = await userService.deleteEmployee(_idDelete);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const phone = req.body.phone;
    const rs = await userService.getUser(phone);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getUser,
  createNew,
  createUser,
  createUserStaff,
  updateAvatar,
  createMany,
  createManyDriver,
  createDriver,
  findDriver,
  findUsers,
  findEmployees,
  updateUser,
  findByID,
  deleteUser,
  deleteManager,
  deleteManagers,
  deleteStaffs,
  deleteMany,
  deleteAll,
  findDriverByFilter,
  findStaffByFilter,
  findManagerByFilter,
  updateDriver,
  deleteDriver,
  deleteDrivers,
  changePassword,
  createEmployee,
  updateEmployee,
  createManyEmployee,
  deleteAllEmployee,
  deleteEmployee,
  deleteEmployees,
  deleteStaff,
};
