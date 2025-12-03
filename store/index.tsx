import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Initial State based on your authSlice
const initialState = {
  login: {
    input: {
      token: localStorage.getItem("token") || "",
      userID: localStorage.getItem("userID") || "",
      user_id: localStorage.getItem("user_id") || "",
      loginAs: localStorage.getItem("loginAs") || "",
      userName: localStorage.getItem("userName") || "",
    },
    auth: {
      uid: !!localStorage.getItem("token"),
    },
  }
};

type State = typeof initialState;
type Action = { type: 'LOGIN'; payload: any } | { type: 'LOGOUT' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        login: {
          input: action.payload,
          auth: { uid: true }
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        login: {
          input: { token: "", userID: "", user_id: "", loginAs: "", userName: "" },
          auth: { uid: false }
        }
      };
    default:
      return state;
  }
};

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hooks to mimic Redux
export const useSelector = (selector: (state: State) => any) => {
  const { state } = useContext(StoreContext);
  return selector(state);
};

export const useDispatch = () => {
  const { dispatch } = useContext(StoreContext);
  return dispatch;
};

export const authActions = {
  login: (payload: any) => ({ type: 'LOGIN', payload } as const),
  logout: () => ({ type: 'LOGOUT' } as const)
};

export default StoreContext;