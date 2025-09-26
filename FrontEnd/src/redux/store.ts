// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import typeBusReducer from "./slices/typeBusSlice";
import tripReducer from "./slices/tripSlice";
import tripDetailReducer from "./slices/tripDetailSlice";
import tripSeatReducer from "./slices/tripSeatSlice";

export const store = configureStore({
  reducer: {
    cities: cityReducer,
    typeBuses: typeBusReducer,
    trips: tripReducer,
    tripDeatails: tripDetailReducer,
    tripSeats: tripSeatReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
