// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "./slices/citySlice";
import locationReducer from "./slices/locationSlice";
import pointReducer from "./slices/pointSlice";
import couponReducer from "./slices/couponSlice";
import typeBusReducer from "./slices/typeBusSlice";
import companyTypeBusReducer from "./slices/companyTypeBusSlice";
import companyBusReducer from "./slices/companyBusSlice";
import companyTemplateReducer from "./slices/companyTemplateSlice";
import companyTripReducer from "./slices/companyTripSlice";
import companyTripPointReducer from "./slices/companyTripPointSlice";
import tripReducer from "./slices/tripSlice";
import tripDetailReducer from "./slices/tripDetailSlice";
import tripSeatReducer from "./slices/tripSeatSlice";
import selectedTicketReducer from "./slices/selectedTripSlice";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import ticketManagementReducer from "./slices/ticketManagementSlice";
import reviewManagementReducer from "./slices/reviewManagementSlice";
import paymentReducer from "./slices/paymentSlice";
import userReducer from "./slices/userSlice";
import partnerReducer from "./slices/partnerSlice";
import homeReducer from "./slices/homeSlice";
import myTicketReducer from "./slices/myTicketSlice";
import staffReducer from "./slices/staffSlice";
import routeReducer from "./slices/routeSlice";
import busRouteReducer from "./slices/busRouteSlice";

export const store = configureStore({
  reducer: {
    cities: cityReducer,
    locations: locationReducer,
    points: pointReducer,
    coupons: couponReducer,
    typeBuses: typeBusReducer,
    companyTypeBuses: companyTypeBusReducer,
    companyBuses: companyBusReducer,
    companyTemplates: companyTemplateReducer,
    companyTrips: companyTripReducer,
    companyTripPoints: companyTripPointReducer,
    trips: tripReducer,
    tripDeatails: tripDetailReducer,
    tripSeats: tripSeatReducer,
    selectedTicket: selectedTicketReducer,
    auth: authReducer,
    ticket: ticketReducer,
    ticketManagement: ticketManagementReducer,
    reviewManagement: reviewManagementReducer,
    payment: paymentReducer,
    users: userReducer,
    partners: partnerReducer,
    home: homeReducer,
    myTicket: myTicketReducer,
    staff: staffReducer,
    routes: routeReducer,
    busRoutes: busRouteReducer,
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
