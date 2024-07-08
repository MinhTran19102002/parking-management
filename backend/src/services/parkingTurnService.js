import { userModel } from '~/models/personModel';
import ApiError from '~/utils/ApiError';
import { parkingModel } from '~/models/parkingModel';
import { parkingTurnModel } from '~/models/parkingTurnModel';
import { vehicleModel } from '~/models/vehicleModel';
import { eventModel } from '~/models/eventModel';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import { required } from 'joi';

const ExcelJS = require('exceljs');
// import XLSXChart from 'xlsx-chart';

// import { writeXLSX } from 'xlsx';

// // import { writeXLSX } from 'xlsx';



const createPakingTurn = async (licenePlate, zone, position, image) => {
  try {
    // Nếu API cần random dữ liệu của zone
    if (zone == '') {
      const zone_random = ['A', 'B', 'C'];
      zone = zone_random[Math.floor(Math.random() * zone_random.length)];
    }
    //tim vehicleId
    let vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);

    if (!vihicle) {
      const createVehicle = await vehicleModel.createNew({ licenePlate: licenePlate, type: 'Car' });
      vihicle = { _id: createVehicle.insertedId };

      if (createVehicle.acknowledged == false) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Xe tạo không thành công',
          'Not Created',
          'BR_vihicle_2',
        );
      }
    }

    //tim parkingId
    const parking = await parkingModel.findOne(zone);
    // Nếu API cần random dữ liệu của position
    let slotRandom;
    if (position == '') {
      if (parking.total == parking.occupied) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Bãi đỗ ' + parking.zone + ' đầy',
          'full',
          'BR_parkingTurn_5',
        );
      }
      do {
        slotRandom = parking.slots[Math.floor(Math.random() * parking.slots.length)];
      } while (!slotRandom.isBlank);
      position = slotRandom.position;
      console.log(slotRandom);
    }

    // them anh o day
    const now = Date.now();
    const data = {
      vehicleId: vihicle._id.toString(),
      parkingId: parking._id.toString(),
      position: position,
      image: image,
      fee: 20000,
      start: now,
      _destroy: false,
    };

    let createPakingTurn = await parkingTurnModel.createNew(data);
    if (createPakingTurn.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Lượt đỗ tạo không thành công',
        'Not Created',
        'BR_parkingTurn_2',
      );
    }
    if (parking.total == parking.occupied + 1)
      await eventModel.createEvent({
        name: 'parking_full',
        zone: parking.zone,
        createdAt: now,
      });
    else if (parking.total - 3 <= parking.occupied + 1) {
      await eventModel.createEvent({
        name: 'almost_full',
        zone: parking.zone,
        createdAt: now,
      });
    }
    await eventModel.createEvent({
      name: 'in',
      eventId: createPakingTurn.insertedId,
      createdAt: now,
    });
    createPakingTurn.position = position
    return createPakingTurn;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};


const createPakingTurnUpdate = async (licenePlate, zone, position, image, datetime) => {
  try {
    // Nếu API cần random dữ liệu của zone
    //tim vehicleId
    console.log(licenePlate)
    let vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);

    if (!vihicle) {
      const createVehicle = await vehicleModel.createNew({ licenePlate: licenePlate, type: 'Car' });
      vihicle = { _id: createVehicle.insertedId };

      if (createVehicle.acknowledged == false) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Xe tạo không thành công',
          'Not Created',
          'BR_vihicle_2',
        );
      }
    }

    //tim parkingId
    const parking = await parkingModel.findOne(zone);
    // Nếu API cần random dữ liệu của position


    // them anh o day
    let now = Date.now();

    if (datetime != "") {
      const timestamp = parseInt(datetime, 10);
      const date = new Date(timestamp);
      now = date.getTime()
    }
    const data = {
      vehicleId: vihicle._id.toString(),
      parkingId: parking._id.toString(),
      image: image,
      fee: 20000,
      start: now,
      _destroy: false,
    };

    let createPakingTurn = await parkingTurnModel.createNewV2(data);
    if (createPakingTurn.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Lượt đỗ tạo không thành công',
        'Not Created',
        'BR_parkingTurn_2',
      );
    }

    await eventModel.createEvent({
      name: 'in',
      eventId: createPakingTurn.insertedId,
      createdAt: now,
    });
    // createPakingTurn.position = position
    return createPakingTurn;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const outPaking = async (licenePlate, datetime) => {
  try {
    //tim vehicleId
    const vihicle = await vehicleModel.findOneByLicenePlate(licenePlate);
    console.log(licenePlate)
    if (!vihicle) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xe không tồn tại',
        'Error',
        'BR_vihicle_5',
      );
    }
    //
    let now = Date.now();
    if (datetime != "") {
      const timestamp = parseInt(datetime, 10);
      const date = new Date(timestamp);
      now = date.getTime()
    }
    const filter = { vehicleId: vihicle._id, _destroy: false };
    const outPaking = await parkingTurnModel.updateOutV2(filter, now, licenePlate);
    if (outPaking.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error');
    }
    await eventModel.createEvent({ name: 'out', eventId: outPaking._id, createdAt: now });
    return outPaking;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getVehicleInOutNumber = async (req, res) => {
  let startDate;
  let endDate;

  if (req.query.startDate === undefined) {
    endDate = moment().clone().add(1, 'days').format('DD/MM/YYYY');
    startDate = moment().clone().subtract(6, 'days').format('DD/MM/YYYY');
  } else {
    startDate = moment(req.query.startDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    endDate = moment(req.query.endDate, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
  }
  try {
    const getVehicleInOutNumber = await parkingTurnModel.getVehicleInOutNumber(startDate, endDate);
    if (outPaking.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê lượt xe không thành công',
        'Not Success',
        'BR_parkingTurn_4',
      );
    }
    return getVehicleInOutNumber;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getVehicleInOutNumberByHour = async (req, res) => {
  let startDate = moment(req.query.date, 'DD/MM/YYYY').format('DD/MM/YYYY')
  let endDate = moment(req.query.date, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
  try {
    const getVehicleInOutNumberByHour = await parkingTurnModel.getVehicleInOutNumberByHour(startDate, endDate);
    if (outPaking.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê lượt xe không thành công',
        'Not Success',
        'BR_parkingTurn_4',
      );
    }
    return getVehicleInOutNumberByHour;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getRevenue = async (req, res) => {
  let startDate;
  let endDate;

  if (req.query.startDate === undefined) {
    endDate = moment().clone().add(1, 'days').format('DD/MM/YYYY');
    startDate = moment().clone().subtract(6, 'days').format('DD/MM/YYYY');
  } else {
    startDate = moment(req.query.startDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    endDate = moment(req.query.endDate, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
  }
  try {
    const getRevenue = await parkingTurnModel.getRevenue(startDate, endDate);
    if (getRevenue.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return getRevenue;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const GetRevenueByHour = async (req, res) => {
  let startDate = moment(req.query.date, 'DD/MM/YYYY').format('DD/MM/YYYY')
  let endDate = moment(req.query.date, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');

  try {
    const GetRevenueByHour = await parkingTurnModel.GetRevenueByHour(startDate, endDate);
    if (GetRevenueByHour.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return GetRevenueByHour;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getEvent = async (req, res) => {
  // const pageIndex = req.query.pageIndex;
  // const pageSize = req.query.pageSize;
  const filter = req.query;
  try {
    let startDay
    let endDay
    if (req.query.startDay !== undefined && req.query.endDay !== undefined) {
      startDay = moment(req.query.startDay, 'DD/MM/YYYY').format('DD/MM/YYYY');
      endDay = moment(req.query.endDay, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    }
    const findEvent = await eventModel.findEvent(filter, startDay, endDay);
    if (findEvent.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    return findEvent;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};




const getByDriver = async (req, res) => {
  // const pageIndex = req.query.pageIndex;
  // const pageSize = req.query.pageSize;
  console.log('111111111111')
  const phone = req.query.phone;
  console.log(phone)
  try {
    const findEvent = await eventModel.getByDriver(phone);
    if (findEvent.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    return findEvent;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const exportEvent = async (req, res) => {
  const filter = { pageSize: 50, pageIndex: 1 };
  try {
    const findEvent = await eventModel.exportEvent(filter);
    if (findEvent.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    const data = findEvent.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.mergeCells('A1:I1');

    // Lấy ô đã gộp
    const mergedCell = worksheet.getCell('A1');

    // Viết dữ liệu vào ô đã gộp
    mergedCell.value = 'Bảng thống kê 50 lượt ra vào gần nhất';
    mergedCell.font = { bold: true, size: 16 };
    mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
    // Thêm dòng tiêu đề
    worksheet.columns = [
      { key: 'stt', width: 15 },
      { key: 'name', width: 15 },
      { key: 'person.name', width: 15 },
      { key: 'person.email', width: 30 },
      { key: 'person.phone', width: 15 },
      { key: 'vehicle.licenePlate', width: 15 },
      {
        key: 'parkingTurn.position',
        width: 15,
        style: { font: { bold: true } },
      },
      { key: 'parkingTurn.fee', width: 15 },
      { key: 'createAt', width: 30 },
    ];
    const headerRow = worksheet.addRow([
      'STT',
      'Sự kiện',
      'Họ và tên',
      'Email',
      'SDT',
      'Biển số',
      'Position',
      'Fee',
      'Thời gian',
    ]);

    // Lấy dòng thứ 2 để đặt kiểu chữ in đậm
    const row2 = worksheet.getRow(2);
    row2.eachCell((cell) => {
      cell.style = { font: { bold: true } };
    });
    let stt = 1;
    // Thêm dữ liệu từ JSON vào Worksheet
    data.forEach((item) => {
      let namePerson = 'Không xác định',
        email = 'Không xác định',
        phone = 'Không xác định',
        fee = '';
      if (item.person) {
        namePerson = item.person.name;
        email = item.person.email;
        phone = item.person.phone;
      }
      if (item.name == 'out') {
        fee = item.parkingTurn.fee + ' VND'
      }
      worksheet.addRow([
        stt++,
        item.name,
        namePerson,
        email,
        phone,
        item.vehicle.licenePlate,
        item.parkingTurn.position,
        fee,
        moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        // Thêm các trường khác theo yêu cầu của bạn
      ]);
    });
    // Tạo một tệp Excel và gửi nó dưới dạng phản hồi HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition',
      'attachment; filename=output.xlsx',
    );
    await workbook.xlsx.write(res);
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const carInSlot = async (zone, position, licenePlate, datetime) => {
  try {

    if (zone == '') {
      const zone_random = ['A', 'B', 'C'];
      zone = zone_random[Math.floor(Math.random() * zone_random.length)];
    }

    const parking = await parkingModel.findOne(zone);
    // Nếu API cần random dữ liệu của position
    let slotRandom;
    if (position == '') {
      if (parking.total == parking.occupied) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Bãi đỗ ' + parking.zone + ' đầy',
          'full',
          'BR_parkingTurn_5',
        );
      }
      do {
        slotRandom = parking.slots[Math.floor(Math.random() * parking.slots.length)];
      } while (!slotRandom.isBlank);
      position = slotRandom.position;
      console.log(slotRandom);
    }

    let now = Date.now();
    if (datetime != "") {
      const timestamp = parseInt(datetime, 10);
      const date = new Date(timestamp);
      now = date.getTime()
    }
    let parkingTurnId = null
    const isOut = false
    // const parking = await parkingModel.findOne(zone)
    let slot = parking.slots.find((element) => element.position === position)
    if (slot.isBlank == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Slot da co xe dau',
        'Not Found',
        'BR_event_1',
      );
    }

    const parkingHollow = await parkingModel.findOne('O')
    if (parkingHollow.slots.length == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Khong co xe nao chua co cho dau ca',
        'Not Found',
        'BR_event_1',
      );
    }

    
    if (parkingHollow.slots.length == 1 && licenePlate == '') {
      parkingTurnId = parkingHollow.slots[0]
      const updateCarHollow = await parkingTurnModel.carOutHollow('O', parkingTurnId)
      const updateParkingTurn = await parkingTurnModel.updateParkingTurn(parking._id, position, parkingTurnId)
      if (updateCarHollow.momodifiedCountdi == 0) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe chua cap nhat ra khoi bai chua dau', 'Not Updated', 'BR_parking_3');
      }
      await eventModel.createEvent({
        zone: zone,
        position: position,
        name: 'inSlot',
        eventId: parkingTurnId,
        createdAt: now,
      });
    }
    let parkingTurnLicene = []
    if (licenePlate != '') {
      parkingTurnLicene = await parkingTurnModel.findOneByLicenePlate(licenePlate)
    }
    if (licenePlate == '' && parkingHollow.slots.length > 1) {
      // const updateParkingTurn = await parkingTurnModel.updateParkingTurn(parking._id, position, '')
      // if (updateCarHollow.momodifiedCountdi == 0) {
      //   throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe chua cap nhat ra khoi bai chua dau', 'Not Updated', 'BR_parking_3');
      // }
      await eventModel.createEvent({
        zone: zone,
        position: position,
        name: 'inSlot',
        createdAt: now,
      });
    }
    if (parkingTurnLicene.length  >0 && parkingHollow.slots.length >= 1) {
      parkingTurnId = parkingTurnLicene[0]._id
      const updateCarHollow = await parkingTurnModel.carOutHollow('O', parkingTurnId)
      if (updateCarHollow.momodifiedCountdi == 0) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe chua cap nhat ra khoi bai chua dau', 'Not Updated', 'BR_parking_3');
      }
      const updateParkingTurn = await parkingTurnModel.updateParkingTurn(parking._id, position, parkingTurnId)

      console.log(updateParkingTurn)

      await eventModel.createEvent({
        zone: zone,
        position: position,
        name: 'inSlot',
        eventId: parkingTurnId,
        createdAt: now,
      });
    }
    const updateSlot = await parkingTurnModel.updateSlot(zone, position, parkingTurnId, isOut)
    return updateSlot
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const carOutSlot = async (zone, position, datetime) => {
  try {
    let parkingTurnId = null
    const isOut = true
    const parking = await parkingModel.findOne(zone)
    let slot = parking.slots.find((element) => element.position === position)
    if (slot.isBlank == true) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Slot khong co xe dau',
        'Not Found',
        'BR_event_1',
      );
    }
    let now = Date.now();
    if (datetime != "") {
      const timestamp = parseInt(datetime, 10);
      const date = new Date(timestamp);
      now = date.getTime()
    }
    const parkingHollow = await parkingModel.findOne('O')
    const updateSlot = await parkingTurnModel.updateSlot(zone, position, parkingTurnId, isOut)
    const updateCarHollow = await parkingTurnModel.carInHollow('O', slot.parkingTurnId)
    if (updateCarHollow.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe chua cap nhat vao bai chua dau', 'Not Updated', 'BR_parking_3');
    }
    const updateParkingTurn = await parkingTurnModel.updateParkingTurn(parking._id, position, slot.parkingTurnId)


    if (updateParkingTurn.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'chua cap nhat xuat dau', 'Not Updated', 'BR_parking_3');
    }
    await eventModel.createEvent({
      zone: zone,
      position: position,
      name: 'outSlot',
      eventId: slot.parkingTurnId,
      createdAt: now,
    });
    return updateSlot
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


const carOutSlotByLicenePlate= async (licenePlate, datetime) => {
  try {
    let parkingTurn = null
    let parkingTurnLicene = await parkingTurnModel.findOneByLicenePlate(licenePlate)
    if (parkingTurnLicene != [])
    {
      parkingTurn =parkingTurnLicene[0]
    }
    const isOut = true
    const parking = await parkingModel.findOneById(parkingTurn.parkingId)
    const parkingTurnId = parkingTurn._id
    const position = parkingTurn.position
    const zone = parking.zone
    let slot = parking.slots.find((element) => element.position === position)
    if (slot.isBlank == true) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Slot khong co xe dau',
        'Not Found',
        'BR_event_1',
      );
    }
    let now = Date.now();
    if (datetime != "") {
      const timestamp = parseInt(datetime, 10);
      const date = new Date(timestamp);
      now = date.getTime()
    }
    const parkingHollow = await parkingModel.findOne('O')
    const updateSlot = await parkingTurnModel.updateSlot(zone, position, parkingTurnId, isOut)
    const updateCarHollow = await parkingTurnModel.carInHollow('O', slot.parkingTurnId)
    if (updateCarHollow.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xe chua cap nhat vao bai chua dau', 'Not Updated', 'BR_parking_3');
    }
    const updateParkingTurn = await parkingTurnModel.updateParkingTurn(parking._id, position, slot.parkingTurnId)


    if (updateParkingTurn.momodifiedCountdi == 0) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'chua cap nhat xuat dau', 'Not Updated', 'BR_parking_3');
    }
    await eventModel.createEvent({
      zone: zone,
      position: position,
      name: 'outSlot',
      eventId: slot.parkingTurnId,
      createdAt: now,
    });
    return updateSlot
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getByFilter = async (req, res) => {
  // const pageIndex = req.query.pageIndex;
  // const pageSize = req.query.pageSize;
  const filter = req.query;
  try {
    const getByFilter = await eventModel.findEvent(filter);
    if (getByFilter.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Không tìm thấy sự kiện',
        'Not Found',
        'BR_event_1',
      );
    }
    return getByFilter;
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


const parseMonth = (str) => {
  const parts = str.split('/');
  if (parts.length === 2) {
    const day = 1;
    const month = parseInt(parts[0] - 1, 10); // Trừ 1 vì tháng bắt đầu từ 0
    const year = parseInt(parts[1], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null; // Trả về null nếu chuỗi không hợp lệ
};

const general = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {
    let general = await parkingTurnModel.general(start, end);
    if (general.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    // general.forEach(function(item, index){
    //   general[index].averageDuration = 
    // })
    // "parking_full"



    return general;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const visistorRate = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {
    const visistorRate = await parkingTurnModel.visistorRate(start, end);
    if (visistorRate.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return visistorRate;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const inoutByTime = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');

    start = Date.parse(parseMonth(startDate));

    end = Date.parse(parseMonth(endDate));
  }
  try {
    const inoutByTime = await parkingTurnModel.inoutByTime(start, end, timeType);
    if (inoutByTime.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return inoutByTime;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const inoutByJob = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {
    const inoutByJob = await parkingTurnModel.inoutByJob(start, end);
    if (inoutByJob.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return inoutByJob;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const inoutByDepa = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {
    const inoutByDepa = await parkingTurnModel.inoutByDepa(start, end);
    if (inoutByDepa.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return inoutByDepa;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const mostParkedVehicle = async (req, res) => {
  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {
    const mostParkedVehicle = await parkingTurnModel.mostParkedVehicle(start, end);
    if (mostParkedVehicle.acknowledged == false) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Thống kê doanh số không thành công',
        'Not Success',
        'BR_parkingTurn_5',
      );
    }
    return mostParkedVehicle;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const exportReport = async (req, res) => {
  // const filter = { pageSize: 50, pageIndex: 1 };

  const timeType = req.query.timeType
  let startDate
  let endDate
  let start
  let end
  if (timeType == "date") {
    startDate = moment(req.query.start, 'DD/MM/YYYY').format('DD/MM/YYYY')
    endDate = moment(req.query.end, 'DD/MM/YYYY').clone().add(1, 'days').format('DD/MM/YYYY');
    start = Date.parse(parseDate(startDate));
    end = Date.parse(parseDate(endDate));
  } else if (timeType == "month") {
    startDate = moment(req.query.start, 'MM/YYYY').format('MM/YYYY')
    endDate = moment(req.query.end, 'MM/YYYY').clone().add(1, 'months').format('MM/YYYY');
    start = Date.parse(parseMonth(startDate));
    end = Date.parse(parseMonth(endDate));
  }
  try {

    const data = await parkingTurnModel.visistorRate(start, end);
    var xlsxChart = new XLSXChart();
    let opts = {
      chart: "pie",
      titles: [
        "Title 1",
      ],
      fields: [
        "visitor",
        "driver"
      ],
      data: {
        "Title 1": {
          "visitor": 5,
          "driver": 10,
        },
      },
      chartTitle: "Title 1"
    }


    xlsxChart.generate(opts, function (err, data) {
      res.set({
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": "attachment; filename=chart.xlsx",
        "Content-Length": data.length
      });
      res.status(200).send(data);
    });
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


export const parkingTurnService = {
  createPakingTurn,
  outPaking,
  getVehicleInOutNumber,
  getVehicleInOutNumberByHour,
  getRevenue,
  GetRevenueByHour,
  getEvent,
  exportEvent,
  getByDriver,
  createPakingTurnUpdate,
  carInSlot,
  carOutSlot,
  getByFilter,
  general,
  visistorRate,
  inoutByTime,
  inoutByJob,
  inoutByDepa,
  mostParkedVehicle,
  exportReport,
  carOutSlotByLicenePlate,
};
