export default {
  hanldeError: (error, onNoti) => {
    const type = 'error';
    console.log('hanldeError', typeof error);
    if (error?.data) {
      let { statusCode = 0, message: description = 'Underfined error', code } = error?.data;
      if (code === 'BR_undefined') {
        description = 'Lỗi không xác định';
      }
      onNoti({ message: description, type });
    } else {
      onNoti({ message: error.status, description: 'Underfined error', type });
    }
  }
};
