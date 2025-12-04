import { useReducer } from "react";
import reducer from "./reducers";
import initialStates from "./initialState";

const [state, dispatch] = useReducer(reducer, initialStates);