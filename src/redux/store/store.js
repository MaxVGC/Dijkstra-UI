import { createStore, combineReducers, applyMiddleware } from "redux";
import dataReducer from "../reducers/data";
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(
    combineReducers({
        data: dataReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;