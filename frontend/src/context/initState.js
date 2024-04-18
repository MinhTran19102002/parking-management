const getIsLogin = () => {
  let auth = localStorage.getItem('auth');
  if (auth) {
    auth = JSON.parse(auth);
  } else {
    auth = {
      isLogin: false
    };
  }
  return auth;
};

const initState = {
  auth: getIsLogin(),
  mess: null,
  noti: null,
  onChangePassword: false,
  parkingEvent: null,
  authorize: null,
  zones: ['A', 'A1', 'A2', 'A3', 'B', 'C']
};

export default initState;
