/* eslint-disable no-undef */
import { array, exist } from 'joi';
import supertest from 'supertest';
import { CLOSE_DB } from '~/config/mongodb';
import { paymentRoute } from '~/routes/v1/paymentRoute';
import { server } from '~/server';
import { cameraService } from '~/services/cameraService';
import { deparmentService } from '~/services/deparmentService';
import { parkingService } from '~/services/parkingService';
import { parkingTurnService } from '~/services/parkingTurnService';
import { paymentService } from '~/services/paymentService';
import { userService } from '~/services/personService';
import { vehicleService } from '~/services/vehicleService';

describe('Test API user', () => {
  beforeAll(async () => {
    await server.connectDB();
  }, 30000);
  // describe('get', () => {
  //   test('shoul 200', async () => {
  //     await supertest(server.app).get('/user/driver').expect(200);
  //   });
  // });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      const login = await userService.login(
        { body: { password: 'Parking@123', username: 'admin', role: 'Admin' } },
        req,
      );
      expect(login.person.account.username).toBe('admin');
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@123', username: 'admin', role: 'dmin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121413', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham login', () => {
    test('Cha ve mot object', async () => {
      let req;
      try {
        const login = await userService.login(
          { body: { password: 'Parking@121342', username: 'admin', role: 'Admin' } },
          req,
        );
        expect(login.person.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Mật khẩu không chính xác');
      }
    });
  });

  describe('Test ham createUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUser = await userService.createUser(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng đã tồn tại');
      }
    });
  });

  describe('Test ham createUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909709720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUser = await userService.createUser(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng đã tồn tại');
      }
    });
  });

  describe('Test ham createUserM', () => {
    test('Cha ve mot object', async () => {
      let data = {
        account: {
          username: 'MaiAnh',
          password: 'Admin@123',
          role: 'Manager',
        },
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const createUserM = await userService.createUserM(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng đã tồn tại');
      }
    });
  });
  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'LinhNguyen',
          password: 'LinhNguyen@123',
          newPassword: 'LinhNguyen@123',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = {
        body: {
          username: 'admin',
          password: 'Parking@123',
          newPassword: 'Parking@123',
          role: 'Admin',
        },
      };
      try {
        const changePassword = await userService.changePassword(data);
        expect(changePassword.account.username).toBe('admin');
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham createManyDriver', () => {
    test('Cha ve mot object', async () => {
      let data = [
        {
          licenePlate: '12A-1134',
          name: 'Tri thieu NGuyf',
          address: 'Tay Ninh',
          phone: '0996319853',
          email: 'thiekfdai1ds@gmail.com',
          job: 'Giảng viên',
          department: 'Cơ khí',
        },
      ];
      try {
        const createManyDriver = await userService.createManyDriver(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham createDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        licenePlate: '12A-1134',
        name: 'Tri thieu NGuyf',
        address: 'Tay Ninh',
        phone: '0996319853',
        email: 'thiekfdai1ds@gmail.com',
        job: 'Giảng viên',
        department: 'Cơ khí',
      };
      try {
        const createDriver = await userService.createDriver(data);
      } catch (error) {
        expect(error.message).toBe('Xe đã có chủ');
      }
    });
  });

  describe('Test ham findByID1', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      try {
        const findByID = await userService.findByID(data);
        expect(findByID.name).toBe('Users not exist');
      } catch (error) {
        expect(error.message).toBe('Users not exist');
      }
    });
  });

  describe('Test ham findByID2', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';

      try {
        const findByID = await userService.findByID(data);
        expect(findByID.name).toBe('Users not exist');
      } catch (error) {
        expect(error.message).toBe('Users not exist');
      }
    });
  });

  describe('Test ham findByID3', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718162';

      try {
        const findByID = await userService.findByID(data);
        expect(findByID.name).toBe('Users not exist');
      } catch (error) {
        expect(error.message).toBe('Users not exist');
      }
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2654086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '6579e0992dd2614086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '657900992dd2614086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriver', () => {
    test('Cha ve mot object', async () => {
      let data = '657900992dd2604086718b62';
      const findDriver = await userService.findDriver();

      expect(findDriver).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriverByFilter', () => {
    test('Cha ve mot object', async () => {
      const findDriver = await userService.findDriverByFilter({});

      expect(findDriver.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findDriverByFilter', () => {
    test('Cha ve mot object', async () => {
      const findDriver = await userService.findDriverByFilter({ pageSize: 1, pageIndex: 1 });

      expect(findDriver.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findManagerByFilter', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findManagerByFilter({});

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });
  describe('Test ham findUsers', () => {
    test('Cha ve mot object', async () => {
      const findManagerByFilter = await userService.findUsers({ role: 'Manager' });

      expect(findManagerByFilter.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham updateUser', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const updateUser = await userService.updateUser('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Người dùng cập nhật không thành công');
      }
    });
  });

  describe('Test ham updateDriver', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Nguyễn Tuấn Công',
        phone: '0357654791',
        email: 'tuancongn13@gmail.com',
        address: 'Tay Ninh',
        licenePlate: '13A-2171',
        job: 'Teacher',
        department: 'Khoa Công nghệ thông tin',
      };
      try {
        const updateDriver = await userService.updateDriver('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Không tìm thấy người');
      }
    });
  });

  describe('Test ham deleteDriver', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDriver = await userService.deleteDriver('6579b62ace8624bd75e24a1f');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteDrivers', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteDrivers = await userService.deleteDrivers(['6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f', '6579b62ace8624bd75e24a1f']);
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteUser', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteUser = await userService.deleteUser('6579b62ace8624bd75e24a1f', 'Manager');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteUser', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteUser = await userService.deleteUser('6579b62ac18624bd78e24a1f', 'Manager');
      } catch (error) {
        expect(error.message).toBe('Người lái không tồn tại');
      }
    });
  });

  describe('Test ham deleteMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.deleteMany({ ids: ['6579b62ace8624bd75e24a1f', '6579b62ace86240175e24a1f'] });
      } catch (error) {
        expect(error.message).toBe('TypeError: ids.map is not a function');
      }
    });
  });
  describe('Test ham findEmployees', () => {
    test('Cha ve mot object', async () => {
      const findEmployees = await userService.findEmployees({});
      expect(findEmployees.data).toEqual(expect.any(Array));
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham createEmployee', () => {
    test('Cha ve mot object', async () => {
      try {
        const deleteMany = await userService.createEmployee({
          name: 'Quách Thị Mai Anh',
          address: 'An Giang',
          phone: '0909749720',
          email: 'maianh332@gmail.com',
        });
      } catch (error) {
        expect(error).toEqual(expect.any(Error));
      }
    });
  });

  describe('Test ham updateEmployee', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0909749720',
        email: 'maianh332@gmail.com',
      };
      try {
        const updateEmployee = await userService.updateEmployee('6579b62ace8624bd75e24a1f', data);
      } catch (error) {
        expect(error.message).toBe('Cập nhật nhân viên không thành công');
      }
    });
  });

  describe('Test ham createManyEmployee', () => {
    test('Cha ve mot object', async () => {
      let data = [
        {
          name: 'Tri thieu NGuyf',
          address: 'Tay Ninh',
          phone: '0996319853',
          email: 'thiekfdai1ds@gmail.com',
        },
      ];
      try {
        const createManyEmployee = await userService.createManyEmployee(data);
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'minh 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'minh 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });

  describe('Test ham checkToken', () => {
    test('Cha ve mot object', async () => {
      let req = { headers: { authorization: 'Bear 31231432424' } };
      try {
        const createManyEmployee = await userService.checkToken(req, {});
      } catch (error) {
        expect(error.message).toBe('Token không hợp lệ');
      }
    });
  });


  describe('Test ham changePassword', () => {
    test('Cha ve mot object', async () => {
      let data = '0789575465'
      try {
        const getUser = await userService.getUser(data);
        expect(getUser).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Người dùng không tồn tại');
      }
    });
  });

  describe('Test ham createUserStaff', () => {
    test('Cha ve mot object', async () => {
      let data = {
        name: 'Quách Thị Mai Anh',
        address: 'An Giang',
        phone: '0789575465',
        email: 'maianh332@gmail.com',
        "account": {
        "username": "data.account.username",
        "password": "hashed",
        "role": "data.account.role"
      },
      };
      let image = '423423d'
      try {
        const getUser = await userService.createUserStaff(data,image );
        expect(getUser).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Trùng SĐT hoặc gmail');
      }
    });
  });


  describe('Test ham createUserStaff', () => {
    test('Cha ve mot object', async () => {
      try {
        const getUser = await userService.findStaffByFilter({} );
        expect(getUser).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Trùng SĐT hoặc gmail');
      }
    });
  });
});


/////Parking
describe('Test API parking', () => {

  // beforeAll(async () => {
  //   await server.connectDB();
  // }, 30000);
  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('A');
      expect(createManyEmployee.zone).toBe('A');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('B');
      expect(createManyEmployee.zone).toBe('B');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      const createManyEmployee = await parkingService.getStatusByZone('C');
      expect(createManyEmployee.zone).toBe('C');
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      try {
        const createManyEmployee = await parkingService.getStatusByZone('D');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham getStatusByZone', () => {
    test('Cha ve mot object', async () => {
      try {
        const createManyEmployee = await parkingService.getStatusByZone('B');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham createPaking', () => {
    test('Cha ve mot object', async () => {
      let data = { zone: 'C', description: '1eqweq', slots: [{ position: 'aewqe' }] };
      try {
        const createPaking = await parkingService.createPaking(data);
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham createPaking', () => {
    test('Cha ve mot object', async () => {
      let data = { zone: 'B', description: '1eqweq', slots: [{ position: 'aewqe' }] };
      try {
        const createPaking = await parkingService.createPaking(data);
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('A');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('B');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      const getStatus = await parkingService.getStatus('C');
      expect(getStatus).toEqual(expect.any(Array));
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      try {
        const getStatus = await parkingService.getStatus('D');
      } catch (error) {
        expect(error.message).toBe('Khu vực không được tìm thấy');
      }
    });
  });


  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      try {
        const getStatus = await parkingService.updateSlot({});
      } catch (error) {
        expect(error.message).toBe('Bãi cập nhật không thành công');
      }
    });
  });

  describe('Test ham getStatus', () => {
    test('Cha ve mot object', async () => {
      try {
        const getStatus = await parkingService.getStatusByDriver('A', '321321');
      } catch (error) {
        expect(error.message).toBe('Bãi cập nhật không thành công');
      }
    });
  });
});

// Parking Turn
describe('Test API ParkingTune', () => {

  // beforeAll(async () => {
  //   await server.connectDB();
  // }, 30000);
  describe('Test ham createPakingTurn', () => {
    test('Cha ve mot object', async () => {
      try {
        const createPakingTurn = await parkingTurnService.createPakingTurn('12A-3231', 'B', 'A105');
        expect(createPakingTurn.acknowledged).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Vị trí đã có xe');
      }
    });
  });

  describe('Test ham outPaking', () => {
    test('Cha ve mot object', async () => {
      try {
        const createPakingTurn = await parkingTurnService.outPaking('98A-3231');
        expect(createPakingTurn.acknowledged).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Xe không tồn tại');
      }
    });
  });


  describe('Test ham outPaking', () => {
    test('Cha ve mot object', async () => {
      try {
        const createPakingTurn = await parkingTurnService.getVehicleInOutNumber({ query: {} }, {});
        expect(createPakingTurn).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('Xe không tồn tại');
      }
    });
  });

  describe('Test ham outPaking', () => {
    test('Cha ve mot object', async () => {
      try {
        const createPakingTurn = await parkingTurnService.getVehicleInOutNumberByHour({ query: {} }, {});
        expect(createPakingTurn).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('Xe không tồn tại');
      }
    });
  });

  describe('Test ham getRevenue', () => {
    test('Cha ve mot object', async () => {
      try {
        const getRevenue = await parkingTurnService.getRevenue({ query: {} }, {});
        expect(getRevenue).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });


  describe('Test ham getRevenue', () => {
    test('Cha ve mot object', async () => {
      try {
        const getRevenue = await parkingTurnService.GetRevenueByHour({ query: {} }, {});
        expect(getRevenue).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });


  describe('Test ham getRevenue', () => {
    test('Cha ve mot object', async () => {
      try {
        const getRevenue = await parkingTurnService.getByDriver({ query: {phone: "3123123"} }, {});
        expect(getRevenue).toEqual(expect.any(Array));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });
  describe('Test ham getEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const getEvent = await parkingTurnService.getEvent({ query: {} }, {});
        expect(getEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('ApiError: Xe không ở trong bãi');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.exportEvent({ query: {} }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });



  describe('Test ham createPakingTurnUpdate', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.createPakingTurnUpdate('licenePlate', 'zone', 'position', 'image', 'datetime');
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('500');
      }
    });
  });


  describe('Test ham createPakingTurnUpdate', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.carInSlot('zone', 'position', 'licenePlate', 'datetime');
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe("Cannot read properties of null (reading 'slots')");
      }
    });
  });


  describe('Test ham createPakingTurnUpdate', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.carOutSlot('zone', 'position', 'licenePlate', 'datetime');
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe("Cannot read properties of null (reading 'slots')");
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.getByFilter({ query: {} }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.general({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });


  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.visistorRate({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.inoutByDepa({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.inoutByJob({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });

  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.inoutByTime({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });


  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.mostParkedVehicle({ query: {
          timeType : "date",
          start: "10/6/2024",
          end: "17/6/2024"
        } }, {});
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('res.setHeader is not a function');
      }
    });
  });


  describe('Test ham exportEvent', () => {
    test('Cha ve mot object', async () => {
      try {
        const exportEvent = await parkingTurnService.carOutSlotByLicenePlate('3123312', '324234234');
        expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe("Cannot read properties of undefined (reading 'parkingId')");
      }
    });
  });
});


//Vihicle
describe('Test API vehicle', () => {
  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3231', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe đã tồn tại');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3231', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe đã tồn tại');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-2171', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe đã tồn tại');
      }
    });
  });

  describe('Test ham createVehicle', () => {
    test('Cha ve mot object', async () => {
      try {
        const createVehicle = await vehicleService.createVehicle('12A-3214', 'Car');
        //expect(exportEvent).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe đã tồn tại');
      }
    });
  });
});


////Camera
describe('Test API Camera', () => {
  //   beforeAll(async () => {
  //   await server.connectDB();
  // }, 30000);

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_32421",
          "name": "Camera khu B1",
          "type": "normal"
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_32421",
          "name": "Camera khu B1",
          "type": "normal"
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_3241",
          "name": "Camera khu B1",
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('\"type\" is required');
      }
    });
  });

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_32421",
          "name": "Camera khu B1",
          "type": "normal"
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_32421",
          "name": "Camera khu B1",
          "type": "normal"
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.createCamera({
          "cameraId": "CAM_32421",
          "name": "Camera khu B1",
          "type": "normal"
        }, "linkanh");
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham updateCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.updateCamera('661686711f5100782f90521c', {
          "name": "Camera khu B5",
          "type": "normal",
          "zone": "B",
          "slots": [
            "B201",
            "B202"
          ],
          "location": {
            "top": 2,
            "left": 6,
            "width": 1,
            "rotate": 1,
            "iconId": "chuoi String"
          }
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });
  describe('Test ham updateCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.updateCamera('661686711f5100782f90521c', {
          "name": "Camera khu B5",
          "type": "normal",
          "zone": "B",
          "slots": [
            "B201",
            "B202"
          ],
          "location": {
            "top": 2,
            "left": 6,
            "width": 1,
            "rotate": 1,
            "iconId": "chuoi String"
          }
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });
  describe('Test ham updateCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.updateCamera('661686711f5100782f90521c', {
          "name": "Camera khu B5",
          "type": "normal",
          "zone": "B",
          "slots": [
            "B201",
            "B202"
          ],
          "location": {
            "top": 2,
            "left": 6,
            "width": 1,
            "rotate": 1,
            "iconId": "chuoi String"
          }
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });
  describe('Test ham updateManyCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.updateManyCamera(
          [
            {
              "_id": "6636f623cf2025bd8e490a5d",
              "cameraId": "CAM_1234222123",
              "name": "Camera khu B1",
              "type": "normal",
              "_destroy": false,
              "location": {
                "cameraIconId": "ver",
                "iconId": "ver",
                "top": 1143,
                "left": 3123
              },
              "zone": "B"
            }
          ]
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe("Cannot read properties of null (reading '_id')");
      }
    });
  });

  describe('Test ham updateManyCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.findByFilter(
          {
            'pageSize': 10,
            'pageIndex': 1
          }
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });

  describe('Test ham updateManyCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.findByFilter(
          {
            'pageSize': 10,
            'pageIndex': 1
          }
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });

  describe('Test ham findByFilterUnused', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.findByFilterUnused(
          {
            'pageSize': 10,
            'pageIndex': 1
          }
          , false
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Camera cập nhật không thành công');
      }
    });
  });

  describe('Test ham deleteCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.deleteCamera(
          "pageSize=10&pageIndex=1"
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
      }
    });
  });


  describe('Test ham deleteCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.deleteCamera(
          "6613c15bbf48175f8ce995de"
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });

  describe('Test ham deleteCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.deleteCamera(
          "6613c15bbf48175f8ce995de"
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });
  describe('Test ham deleteCamera', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.deleteManyCamera(
          ["6613c15bbf48175f8ce995de"]
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });
  describe('Test ham checkCameraId', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await cameraService.checkCameraId(
          "6636f623cf2025bd8e490a5d"
        );
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });

  describe('Test ham findByFilterUnused', () => {
    test('Cha ve mot object', async () => {
      try {
        const findByFilterUnused = await cameraService.findByFilterUnused(
          {}, false
        );
        expect(findByFilterUnused).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });


  describe('Test ham findByFilterUnused', () => {
    test('Cha ve mot object', async () => {
      try {
        const findByFilterUnused = await cameraService.findByFilterUnused(
          { name: 'CAM' }, false
        );
        expect(findByFilterUnused).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });

  describe('Test ham findByFilterUnused', () => {
    test('Cha ve mot object', async () => {
      try {
        const findByFilterUnused = await cameraService.findByFilterUnused(
          { name: 'fagsadgfd' }, false
        );
        expect(findByFilterUnused).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });


  describe('Test ham checkCameraId', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.checkCameraId(
          '66761bbb32200b6a5754e400'
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });


  describe('Test ham checkCameraId', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.checkCameraId(
          '6636f623cf2025bd8e490a5d'
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });



  describe('Test ham checkCameraId', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.checkCameraId(
          '6636f623cf2025bd8e490a5'
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xóa người dùng không thành công');
      }
    });
  });


  describe('Test ham updateSlot', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.updateSlot(
          "CAM_1234222123",
          [
            "B101", "B202"
          ]
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tim thay camera');
      }
    });
  });

  describe('Test ham updateSlot', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.updateSlot(
          "CAM_1234222123",
          []
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tim thay camera');
      }
    });
  });

  describe('Test ham setCameraAI', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.setCameraAI(
          '6636f623cf2025bd8e490a5', 'fsadfs'
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong co loai camera do');
      }
    });
  });


  describe('Test ham setCameraAI', () => {
    test('Cha ve mot object', async () => {
      try {
        const checkCameraId = await cameraService.findCameraAIByType(
          '6636f623cf2025bd8'
        );
        expect(checkCameraId).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong co loai camera do');
      }
    });
  });
});



//Payment
describe('Test API Payment', () => {

  // beforeAll(async () => {
  //   await server.connectDB();
  // }, 30000);
  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.register({
          "licenePlate": "51H-59951",
          "startDay": 1719013176000,
          "months": 4
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe hien da dang ky nao ngay nay roi');
      }
    });
  });


  describe('Test ham cameraService', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.register({
          "licenePlate": "51H-59951",
          "startDay": 1719013176000,
          "months": 3
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe hien da dang ky nao ngay nay roi');
      }
    });
  });


  describe('Test ham register', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.register({
          "licenePlate": "51H-59951",
          "startDay": 1729013176000,
          "months": 4
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Xe hien da dang ky nao ngay nay roi');
      }
    });
  });



  describe('Test ham findById4', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.findById({
          "paymentId": "66764cada182622e160cb2d9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tim kiem thay payment nao');
      }
    });
  });


  describe('Test ham findById5', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.findById({
          "paymentId": "66764cada182622e160cb2f5"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tim kiem thay payment nao');
      }
    });
  });


  describe('Test ham findById6', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.findById({
          "paymentId": "fdsafasdf"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
      }
    });
  });

  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada182622e160cb2d9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Luu thong tin thanh toan khong thanh cong');
      }
    });
  });


  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada1826e160cb2d9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
      }
    });
  });


  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada182622e160cb2a9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Luu thong tin thanh toan khong thanh cong');
      }
    });
  });
  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada181622e160cb2a9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Luu thong tin thanh toan khong thanh cong');
      }
    });
  });
  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada182322e160cb2a9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Luu thong tin thanh toan khong thanh cong');
      }
    });
  });
  describe('Test ham save_payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.save_payment({
          "paymentId": "66764cada152622e160cb2a9"
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Luu thong tin thanh toan khong thanh cong');
      }
    });
  });



  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cada152622e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cada152622e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cada1522e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
      }
    });
  });

  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cad3152622e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cada101622e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham payment', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.payment({
          body: {
            paymentId: "66764cad9252622e160cb2a9"
          },
          connection: {
            remoteAddress: '0.0.0.0'
          },
          headers: {'x-forwarded-for': '0.0.0.0'},
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });


  describe('Test ham findByfilter', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.findByfilter({
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham findByfilter', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.findByfilter({
          licenePlate: '51H'
        });
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('Khong tin thay thong tin dang ky');
      }
    });
  });

  describe('Test ham findByfilter', () => {
    test('Cha ve mot object', async () => {
      try {
        const createCamera = await paymentService.cancel(
          '43242rdsrfsf');
        expect(createCamera).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
      }
    });
  });
})



////Deparment
describe('Test API Deparment', () => {
  //   beforeAll(async () => {
  //   await server.connectDB();
  // }, 30000);

  describe('Test ham createMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const Deparment = await deparmentService.createMany([]);
        expect(Deparment).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });


  describe('Test ham createMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const Deparment = await deparmentService.createMany(['fafs','fasdf']);
        expect(Deparment).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });

  describe('Test ham createMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const Deparment = await deparmentService.createMany(['fafs','fasdf']);
        expect(Deparment).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });


  describe('Test ham createMany', () => {
    test('Cha ve mot object', async () => {
      try {
        const Deparment = await deparmentService.findAll();
        expect(Deparment).toEqual(expect.any(Object));
      } catch (error) {
        expect(error.message).toBe('CameraId đã tồn tại');
      }
    });
  });
})
