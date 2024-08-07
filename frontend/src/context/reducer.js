const reducer = (state, action) => {
  switch (action.type) {
    case 'auth': {
      return {
        ...state,
        auth: action.payload
      };
    }

    case 'theme': {
      return {
        ...state,
        theme: action.payload
      };
    }

    case 'language': {
      return {
        ...state,
        language: action.payload
      };
    }

    case 'mess': {
      return {
        ...state,
        mess: action.payload
      };
    }
    case 'noti': {
      return {
        ...state,
        noti: action.payload
      };
    }

    case 'onChangePassword': {
      return {
        ...state,
        onChangePassword: action.payload
      };
    }

    case 'parkingEvent': {
      return {
        ...state,
        parkingEvent: action.payload
      };
    }

    case 'authorize': {
      return {
        ...state,
        authorize: action.payload
      };
    }

    default:
      return state;
  }
};

export default reducer;
