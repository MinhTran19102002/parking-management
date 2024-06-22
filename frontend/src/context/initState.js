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
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'vi',
  mess: null,
  noti: null,
  onChangePassword: false,
  parkingEvent: null,
  authorize: null,
  zones: ['A', 'B', 'C'],
  jobs: ['Teacher', 'Student', 'Employee'],
  eventInfor: [
    {
      name: 'in'
    },
    {
      name: 'out'
    },
    {
      name: 'inSlot'
    },
    {
      name: 'outSlot'
    }
  ]
};

export default initState;
