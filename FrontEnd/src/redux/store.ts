// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import locationReducer from "./slices/locationSlice";
import pointReducer from "./slices/pointSlice";
import couponReducer from "./slices/couponSlice";
import typeBusReducer from "./slices/typeBusSlice";
import tripReducer from "./slices/tripSlice";
import tripDetailReducer from "./slices/tripDetailSlice";
import tripSeatReducer from "./slices/tripSeatSlice";
import selectedTicketReducer from "./slices/selectedTripSlice";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import paymentReducer from "./slices/paymentSlice";
import userReducer from "./slices/userSlice";
import partnerReducer from "./slices/partnerSlice";
import homeReducer from "./slices/homeSlice";
import myTicketReducer from "./slices/myTicketSlice";

export const store = configureStore({
  reducer: {
    cities: cityReducer,
    locations: locationReducer,
    points: pointReducer,
    coupons: couponReducer,
    typeBuses: typeBusReducer,
    trips: tripReducer,
    tripDeatails: tripDetailReducer,
    tripSeats: tripSeatReducer,
    selectedTicket: selectedTicketReducer,
    auth: authReducer,
    ticket: ticketReducer,
    payment: paymentReducer,
    users: userReducer,
    partners: partnerReducer,
    home: homeReducer,
    myTicket: myTicketReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
