import dayjs from 'dayjs';
import { UserApi } from '~/api';

function generateEmail(username) {
  const email = `${username}@gmail.com`;
  return email;
}

function generatePhone() {
  // Tạo số ngẫu nhiên từ 10000000 đến 99999999
  var randomNumber = Math.floor(Math.random() * 90000000) + 10000000;

  return `03${randomNumber}`;
}

const teacher_departments = [
  'Khoa Lý luận Chính trị',
  'Khoa Khoa học ứng dụng',
  'Khoa Cơ khí Chế tạo máy',
  'Khoa Điện - Điện tử',
  'Khoa Cơ khí Động Lực',
  'Khoa Kinh tế',
  'Khoa Công nghệ thông tin',
  'Khoa In và Truyền thông',
  'Khoa Công nghệ May và Thời Trang',
  'Khoa Công nghệ Hóa học và Thực phẩm',
  'Khoa Xây dựng',
  'Khoa Ngoại ngữ',
  'Khoa Đào tạo Chất lượng cao',
  'Viện Sư phạm Kỹ thuật',
  'Trường Trung học Kỹ thuật Thực hành'
];

const avts = [
  'https://danviet.mediacdn.vn/296231569849192448/2022/7/18/a33b29c7c6b604e85da7-1658133524535230644268.jpg',
  'https://cafefcdn.com/thumb_w/640/203337114487263232/2024/1/2/avatar1704200715756-17042007161791079596829.jpg',
  'https://nguoinoitieng.tv/images/thumbnail/101/bfk8.jpg',
  'https://nguoinoitieng.tv/images/thumbnail/0/gs.jpg',
  'https://nguoinoitieng.tv/images/thumbnail/104/bhu9.jpg'
];

const emp_departments = [
  'Phòng Đào tạo',
  'Phòng Đào tạo không chính quy',
  'Phòng Tuyển sinh và Công tác Sinh viên',
  'Phòng Truyền thông',
  'Phòng Khoa học Công nghệ - Quan hệ Quốc tế',
  'Phòng Quan hệ Doanh nghiệp',
  'Phòng Thanh tra - Giáo dục',
  'Phòng Đảm bảo Chất lượng',
  'Phòng Tổ chức - Hành chính',
  'Phòng Kế hoạch - Tài chính',
  'Phòng Quản trị Cơ sở Vật chất',
  'Phòng Thiết bị - Vật tư',
  'Ban quản lý KTX',
  'Trạm Y tế'
];

const jobs = [
  { name: 'Teacher', departments: [...teacher_departments] },
  { name: 'Employee', departments: [...emp_departments] },
  { name: 'Student', departments: [...teacher_departments] }
];

function generateUsername(fullName) {
  const cleanName = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const [ho, tenDem, ten] = cleanName.split(' ');

  const username = `${ten}${tenDem?.charAt(0)}${ho}`;

  function removeVietnameseAccents(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  return removeVietnameseAccents(username);
}

const fullNames = (length = 100) => {
  // Các họ và tên người Việt Nam
  const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
  const tenDem = ['Thị', 'Văn', 'Xuân', 'Minh', 'Hoàng', 'Quốc', 'Thành', 'Hữu', 'Đức', 'Tường'];
  const ten = ['Hương', 'Anh', 'Nam', 'Linh', 'Duy', 'Thu', 'Tâm', 'Tuấn', 'Hải', 'Hạnh'];

  // Hàm tạo họ tên ngẫu nhiên
  function getRandomName() {
    const randomHo = ho[Math.floor(Math.random() * ho.length)];
    const randomTenDem = tenDem[Math.floor(Math.random() * tenDem.length)];
    const randomTen = ten[Math.floor(Math.random() * ten.length)];
    return `${randomHo} ${randomTenDem} ${randomTen}`;
  }

  // Tạo mảng 100 phần tử
  const mangHoTen = Array.from({ length }, () => getRandomName());

  return mangHoTen;
};

const addresses = [
  '123 Đường ABC, Quận 1, TP HCM',
  '456 Đường XYZ, Quận 2, TP HCM',
  '789 Đường LMN, Quận 3, TP HCM',
  '101 Đường PQR, Quận 4, TP HCM',
  '202 Đường UVW, Quận 5, TP HCM',
  '303 Đường XYZ, Quận 6, TP HCM',
  '404 Đường LMN, Quận 7, TP HCM',
  '505 Đường ABC, Quận 8, TP HCM',
  '606 Đường PQR, Quận 9, TP HCM',
  '707 Đường UVW, Quận 10, TP HCM',
  '808 Đường XYZ, Quận 11, TP HCM',
  '909 Đường LMN, Quận 12, TP HCM',
  '121 Đường ABC, Quận Bình Thạnh, TP HCM',
  '131 Đường PQR, Quận Tân Bình, TP HCM',
  '141 Đường UVW, Quận Phú Nhuận, TP HCM',
  '151 Đường XYZ, Quận Tân Phú, TP HCM',
  '161 Đường LMN, Quận Gò Vấp, TP HCM',
  '171 Đường ABC, Quận Bình Tân, TP HCM',
  '181 Đường PQR, Quận Thủ Đức, TP HCM',
  '191 Đường UVW, Quận Cần Giờ, TP HCM',
  '202 Đường XYZ, Quận 1, TP HCM',
  '303 Đường LMN, Quận 2, TP HCM',
  '404 Đường ABC, Quận 3, TP HCM',
  '505 Đường PQR, Quận 4, TP HCM',
  '606 Đường UVW, Quận 5, TP HCM',
  '707 Đường XYZ, Quận 6, TP HCM',
  '808 Đường LMN, Quận 7, TP HCM',
  '909 Đường ABC, Quận 8, TP HCM',
  '121 Đường PQR, Quận 9, TP HCM',
  '131 Đường UVW, Quận 10, TP HCM',
  '141 Đường XYZ, Quận 11, TP HCM',
  '151 Đường LMN, Quận 12, TP HCM',
  '161 Đường ABC, Quận Bình Thạnh, TP HCM',
  '171 Đường PQR, Quận Tân Bình, TP HCM',
  '181 Đường UVW, Quận Phú Nhuận, TP HCM',
  '191 Đường XYZ, Quận Tân Phú, TP HCM',
  '202 Đường LMN, Quận Gò Vấp, TP HCM',
  '303 Đường ABC, Quận Bình Tân, TP HCM',
  '404 Đường PQR, Quận Thủ Đức, TP HCM',
  '505 Đường UVW, Quận Cần Giờ, TP HCM',
  '606 Đường XYZ, Quận 1, TP HCM',
  '707 Đường LMN, Quận 2, TP HCM',
  '808 Đường ABC, Quận 3, TP HCM',
  '909 Đường PQR, Quận 4, TP HCM',
  '121 Đường UVW, Quận 5, TP HCM',
  '131 Đường XYZ, Quận 6, TP HCM',
  '141 Đường LMN, Quận 7, TP HCM',
  '151 Đường ABC, Quận 8, TP HCM',
  '161 Đường PQR, Quận 9, TP HCM',
  '171 Đường UVW, Quận 10, TP HCM',
  '181 Đường XYZ, Quận 11, TP HCM',
  '191 Đường LMN, Quận 12, TP HCM',
  '202 Đường ABC, Quận Bình Thạnh, TP HCM',
  '303 Đường PQR, Quận Tân Bình, TP HCM',
  '404 Đường UVW, Quận Phú Nhuận, TP HCM',
  '505 Đường XYZ, Quận Tân Phú, TP HCM',
  '606 Đường LMN, Quận Gò Vấp, TP HCM',
  '707 Đường ABC, Quận Bình Tân, TP HCM',
  '808 Đường PQR, Quận Thủ Đức, TP HCM',
  '909 Đường UVW, Quận Cần Giờ, TP HCM',
  '121 Đường XYZ, Quận 1, TP HCM',
  '131 Đường LMN, Quận 2, TP HCM',
  '141 Đường ABC, Quận 3, TP HCM',
  '151 Đường PQR, Quận 4, TP HCM',
  '161 Đường UVW, Quận 5, TP HCM',
  '171 Đường XYZ, Quận 6, TP HCM',
  '181 Đường LMN, Quận 7, TP HCM',
  '191 Đường ABC, Quận 8, TP HCM',
  '202 Đường PQR, Quận 9, TP HCM',
  '303 Đường UVW, Quận 10, TP HCM',
  '404 Đường XYZ, Quận 11, TP HCM',
  '505 Đường LMN, Quận 12, TP HCM',
  '606 Đường ABC, Quận Bình Thạnh, TP HCM',
  '707 Đường PQR, Quận Tân Bình, TP HCM',
  '808 Đường UVW, Quận Phú Nhuận, TP HCM',
  '909 Đường XYZ, Quận Tân Phú, TP HCM',
  '121 Đường LMN, Quận Gò Vấp, TP HCM',
  '131 Đường ABC, Quận Bình Tân, TP HCM',
  '141 Đường PQR, Quận Thủ Đức, TP HCM',
  '151 Đường UVW, Quận Cần Giờ, TP HCM',
  '161 Đường XYZ, Quận 1, TP HCM',
  '171 Đường LMN, Quận 2, TP HCM',
  '181 Đường ABC, Quận 3, TP HCM',
  '191 Đường PQR, Quận 4, TP HCM',
  '202 Đường UVW, Quận 5, TP HCM',
  '303 Đường XYZ, Quận 6, TP HCM',
  '404 Đường LMN, Quận 7, TP HCM',
  '505 Đường ABC, Quận 8, TP HCM',
  '606 Đường PQR, Quận 9, TP HCM',
  '707 Đường UVW, Quận 10, TP HCM',
  '808 Đường XYZ, Quận 11, TP HCM',
  '909 Đường LMN, Quận 12, TP HCM',
  '121 Đường ABC, Quận Bình Thạnh, TP HCM',
  '131 Đường PQR, Quận Tân Bình, TP HCM',
  '141 Đường UVW, Quận Phú Nhuận, TP HCM',
  '151 Đường XYZ, Quận Tân Phú, TP HCM',
  '161 Đường LMN, Quận Gò Vấp, TP HCM',
  '171 Đường ABC, Quận Bình Tân, TP HCM',
  '181 Đường PQR, Quận Thủ Đức, TP HCM',
  '191 Đường UVW, Quận Cần Giờ, TP HCM'
];

const GetLicenePlateArr = () => {
  const rs = [];
  const len = Math.round(Math.random() * 1);
  for (let i = 0; i < len; i++) {
    rs.push(generateLicenePlate());
  }
  return rs;
};

export const GetDrivers = (departments, jobs) => {
  const names = fullNames();
  return licenePlates.map((lp, i) => {
    const name = names[i];
    const username = generateUsername(name);
    const phone = generatePhone();
    return {
      name: name,
      email: generateEmail(username),
      department: departments[Math.floor(Math.random() * departments.length)],
      job: jobs[Math.floor(Math.random() * jobs.length)],
      address: addresses[i],
      phone,
      licenePlate: [lp, ...GetLicenePlateArr()],
      account: {
        username: phone,
        password: `Parking@${phone}`
      }
    };
  });
};

export const GetParkingsTurn = () => {
  async function urlToFile(url, filename, mimeType) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }
  // Usage example
  const filename = 'image.jpg';
  const mimeType = 'image/jpeg';

  return licenePlates.map(async (licenePlate) => {
    const imageUrl = `./Images/${licenePlate}.png`;
    return {
      licenePlate,
      dateTime: dayjs().add(1, 'M').format('x'),
      image: await urlToFile(imageUrl, filename, mimeType)
    };
  });
};

export const addManyUser = async () => {
  const userList = users();
  const rs = await UserApi.addMany(userList);
};

export const addManyDriver = async () => {
  let driverList = [];
  const names = fullNames();
  for (let i = 0; i < 100; i++) {
    const randomNumber = Math.floor(Math.random() * 3);
    const name = names[i];
    const username = generateUsername(name);
    const email = generateEmail(username);
    const jobObj = jobs[randomNumber];
    const job = jobObj.name;
    const deparment = jobObj.departments[Math.floor(Math.random() * jobObj.departments.length)];
    const licenePlate = generateLicenePlate(/^\d{2}[A-Z]-\d{4,5}$/);
    driverList.push({
      licenePlate,
      name,
      address: addresses[i],
      phone: generatePhone(),
      email,
      job,
      deparment
    });
  }
  console.log('drivers', driverList);
  // const rs = await UserApi.addMany(userList);
};

function generateLicenePlate(pattern = /^\d{2}[A-Z]-\d{4,5}$/) {
  const twoDigits = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const capitalLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const fourToFiveDigits = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(4, '0');

  return `${twoDigits}${capitalLetter}-${fourToFiveDigits}`;
}

const licenePlates = [
  '38A-22222',
  '88A-28888',
  '30A-77777',
  '51A-88888',
  '99K-9999',
  '29A-09999',
  '38A-27203',
  '37A-44444',
  '30E-92291',
  '88A-48888',
  '64A-04075',
  '51H-59565',
  '95A-01379',
  '88H-8888',
  '51H-58825',
  '88A-22999',
  '15K-17707',
  '51G-55555',
  '30G-49944',
  '51G-55555',
  '75A-11412',
  '51G-00776',
  '51A-13883',
  '76A-22222',
  '37A-86868',
  '35A-33333',
  '51A-17556',
  '51F-82743',
  '95L-3456',
  '30F-66666',
  '51F-88838',
  '36A-66666',
  '51H-99999',
  '37A-55555',
  '20A-12894',
  '37A-85667',
  '66C-03827',
  '80A-91999',
  '30G-53507',
  '88A-39307',
  '30G-91632',
  '30G-63611'
];
