import multer from 'multer'
import path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tạo đường dẫn tương đối đến thư mục uploads trong dự án
    cb(null, path.join(__dirname, '..', 'uploads/parkingTurn'));
  }, // Thư mục lưu trữ
  filename: (req, file, cb) => {
    // Tạo tên file mới
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
  }
});

let uploadImage = multer({ storage: storage }).single('image');

const uploadImageHandler = async  (req, res, flag) => {
  await new Promise((resolve, reject) => {
    uploadImage(req, res, function (err) {
        if (err) {
            reject(err); // Ném lỗi nếu có lỗi xảy ra
        } else {
            resolve(); // Thông báo hoàn thành thành công
        }
    });
});
console.log(req.body.licenePlate)
  if(flag == 1)
    return {file: req.file,licenePlate: req.body.licenePlate, zone: req.body.zone , position: req.body.position}
  else if(flag == 2)
    return {file: req.file,licenePlate: req.body.licenePlate, zone: req.body.zone }
  else return {file: req.file,licenePlate: req.body.licenePlate}
}

export default uploadImageHandler;

