const initialState = {
  picture: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_PICTURE":
      return {
        ...state,
        picture: action.payload
      };
    default:
      return state;
  }
}
