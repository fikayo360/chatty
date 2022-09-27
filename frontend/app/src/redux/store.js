import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import notificationReducer from "./notifications"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux'


const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({ 
  user: userReducer,
  notification: notificationReducer
})


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)