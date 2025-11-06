// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import locationReducer from "./slices/locationSlice";
import typeBusReducer from "./slices/typeBusSlice";
import tripReducer from "./slices/tripSlice";
import tripDetailReducer from "./slices/tripDetailSlice";
import tripSeatReducer from "./slices/tripSeatSlice";
import selectedTicketReducer from "./slices/selectedTripSlice";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import paymentReducer from "./slices/paymentSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    cities: cityReducer,
    locations: locationReducer,
    typeBuses: typeBusReducer,
    trips: tripReducer,
    tripDeatails: tripDetailReducer,
    tripSeats: tripSeatReducer,
    selectedTicket: selectedTicketReducer,
    auth: authReducer,
    ticket: ticketReducer,
    payment: paymentReducer,
    users: userReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
