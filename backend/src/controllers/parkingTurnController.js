import { StatusCodes } from 'http-status-codes';
import { parkingTurnService } from '~/services/parkingTurnService';
import {server} from '~/server'
import {uploadImageHandler} from '~/utils/uploads'


const createNew = async (req, res, next) => {
  try {
    // let licenePlate = req.body.licenePlate;
    // let zone = req.body.zone;
    // let position = req.body.position;

    
    const  file= await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let licenePlate = req.body.licenePlate
    let  zone = req.body.zone
    let position = req.body.position
    let image = file.filename;
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutPosition = async (req, res, next) => {
  try {
    // let licenePlate = req.body.licenePlate;
    // let zone = req.body.zone;
    
    const  file = await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let licenePlate = req.body.licenePlate
    let  zone = req.body.zone
    let position = '';
    let image = file.filename;
    
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    server.io.emit('notification-parking', { message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutZone = async (req, res, next) => {
  try {
    
    let file= await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let zone = '';
    let position = '';
    let image = file.filename;
    let licenePlate = req.body.licenePlate
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    console.log('loi o day')
    server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
}

const createNewZone = async (req, res, next) => {
  try {
    
    let file= await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let zone = 'O';
    let position = '';
    let image = file.filename;
    let licenePlate = req.body.licenePlate
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurnUpdate(licenePlate, zone, position, image);
    console.log('loi o day')
    server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
}


// const createPakingOrOut = async (req, res, next) => {
//   try {
    
//     let file= await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
//     let zone = 'O';
//     let position = '';
//     let image = file.filename;
//     let licenePlate = req.body.licenePlate
//     // Dieu huong sang tang Service
//     const createUser = await parkingTurnService.createPakingTurnUpdate(licenePlate, zone, position, image);
//     console.log('loi o day')
//     server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
//     res.status(StatusCodes.CREATED).json(createUser);
//   } catch (error) {
//     next(error);
//   }
// }


const outPaking = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    console.log(licenePlate)

    // Dieu huong sang tang Service
    const outPaking = await parkingTurnService.outPaking(licenePlate);
    server.io.emit('notification-parking',{ message:  'Car goes to the parking lot'})
    res.status(StatusCodes.OK).json(outPaking);
  } catch (error) {
    next(error);
  }
};

const getVehicleInOutNumber = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getVehicleInOutNumber = await parkingTurnService.getVehicleInOutNumber(req, res);

    res.status(StatusCodes.OK).json(getVehicleInOutNumber);
  } catch (error) {
    next(error);
  }
};

const getVehicleInOutNumberByHour = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getVehicleInOutNumberByHour = await parkingTurnService.getVehicleInOutNumberByHour(req, res);

    res.status(StatusCodes.OK).json(getVehicleInOutNumberByHour);
  } catch (error) {
    next(error);
  }
};


const getRevenue = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getRevenue(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const GetRevenueByHour = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const GetRevenueByHour = await parkingTurnService.GetRevenueByHour(req, res);

    res.status(StatusCodes.OK).json(GetRevenueByHour);
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getEvent(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const getByDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getByDriver(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const exportEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    await parkingTurnService.exportEvent(req, res);
    // res.status(StatusCodes.OK).json('Thanh cong');
  } catch (error) {
    next(error);
  }
};


const carInSlot = async (req, res, next) => {
  try {
    const zone = req.body.zone;
    const position = req.body.position;

    // Dieu huong sang tang Service
    const carInSlot = await parkingTurnService.carInSlot(zone, position);
    // server.io.emit('notification-parking',{ message:  'Car goes to the parking lot'})
    res.status(StatusCodes.OK).json(carInSlot);
  } catch (error) {
    next(error);
  }
};

const carOutSlot = async (req, res, next) => {
  try {
    
    const zone = req.body.zone;
    const position = req.body.position;
    // Dieu huong sang tang Service
    const outPaking = await parkingTurnService.carOutSlot(zone, position);
    server.io.emit('notification-parking',{ message:  'Car goes to the parking lot'})
    res.status(StatusCodes.OK).json(outPaking);
  } catch (error) {
    next(error);
  }
};

const getByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getByFilter(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};



const visistorRate = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const GetRevenueByHour = await parkingTurnService.visistorRate(req, res);

    res.status(StatusCodes.OK).json(GetRevenueByHour);
  } catch (error) {
    next(error);
  }
};

const inoutByTime = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByTime = await parkingTurnService.inoutByTime(req, res);

    res.status(StatusCodes.OK).json(inoutByTime);
  } catch (error) {
    next(error);
  }
};


const inoutByJob = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByJob = await parkingTurnService.inoutByJob(req, res);

    res.status(StatusCodes.OK).json(inoutByJob);
  } catch (error) {
    next(error);
  }
};

const inoutByDepa = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByDepa = await parkingTurnService.inoutByDepa(req, res);

    res.status(StatusCodes.OK).json(inoutByDepa);
  } catch (error) {
    next(error);
  }
};

const mostParkedVehicle = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const mostParkedVehicle = await parkingTurnService.mostParkedVehicle(req, res);

    res.status(StatusCodes.OK).json(mostParkedVehicle);
  } catch (error) {
    next(error);
  }
};


export const parkingTurnController = {
  createNew,
  createNewWithoutPosition,
  createNewWithoutZone,
  outPaking,
  getVehicleInOutNumber,
  getVehicleInOutNumberByHour,
  getRevenue,
  GetRevenueByHour,
  getEvent,
  exportEvent,
  getByDriver,
  createNewZone,
  carInSlot, 
  carOutSlot,
  getByFilter,
  visistorRate,
  inoutByTime,
  inoutByJob,
  inoutByDepa,
  mostParkedVehicle,
  // createPakingOrOut,
};
