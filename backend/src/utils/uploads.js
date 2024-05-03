import multer from 'multer'
import path from 'path';

let folder = 'parkingTurn'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tạo đường dẫn tương đối đến thư mục uploads trong dự án
    cb(null, path.join(__dirname, '..', 'uploads/'+folder));
  }, // Thư mục lưu trữ
  filename: (req, file, cb) => {
    // Tạo tên file mới
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    // console.log(req.body )
    if(folder == 'camera'){
      cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
    }
    else{
      cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext);
    }
    
  }
});

let uploadImage = multer({ storage: storage }).single('image');

let uploadImageS = multer({ storage: storage }).array('images', 15);

const uploadImageSingle = async (req, res,type ) => {
  folder = type
  await new Promise((resolve, reject) => {
    uploadImage(req, res, function (err) {
      //console.log(req.body )
      if (err) {
        reject(err); // Ném lỗi nếu có lỗi xảy ra
      } else {
        resolve(); // Thông báo hoàn thành thành công
      }
    });
  });
  return req.file
}

const uploadImageMultiple  = async (req, res,type ) => {
  folder = type
  // if (!req.files || !req.files.length || !req.file) {
  //   console.log(req.body)
  //   return []
  // }
  await new Promise((resolve, reject) => {
    uploadImageS(req, res, function (err) {
      if (err) {
        reject(err); // Ném lỗi nếu có lỗi xảy ra
      } else {
        resolve(); // Thông báo hoàn thành thành công
      }
    });
  });
  const filenames = req.files.map(file => file.filename);
  return filenames
}


export const uploadImageHandler = {
  uploadImageSingle,
  uploadImageMultiple
}

