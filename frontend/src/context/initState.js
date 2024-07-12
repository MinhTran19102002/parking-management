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
    },
    {
      name: 'almost_full'
    },
    {
      name: 'parking_full'
    },
  ],
  departments: [
    'KLLCT',
    'KKHUD',
    'KCKCTM',
    'KDĐT',
    'KCKDL',
    'KKT',
    'KCNTT',
    'KITTT',
    'KCNMVT',
    'KCNHHVTP',
    'KXD',
    'KNN',
    'KĐTCLC',
    'VSPKT',
    'TTHKTTH',
    'PDT',
    'PDTKCQ',
    'PTSVCTS',
    'PTT',
    'PQHDN',
    'PTTGD',
    'PĐBCL',
    'PTCHC',
    'PKHTC',
    'PQTCSVC',
    'PTBVT',
    'BQLKTX',
    'TYT',
    'BQLHSDA'
  ],
  cameraInfor: {
    aiTypes: ['cameraOut', 'cameraIn', 'cameraSlot']
  }
};

export default initState;
