import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { InformationCheckout, ITripPayload, IUserInformation } from "@/types/selectedTrip";

const initialState: InformationCheckout = {
  tripId: "",
  route: "",
  busCompanyName: "",
  tripImage: "",
  departureTime: new Date().toISOString(),
  arrivalTime: new Date().toISOString(),
  typeBusName: "",
  selectedSeats: [],
  selectedPickUpPoint: undefined,
  selectedDropOffPoint: undefined,
  totalPrice: 0,
  userInformation: {
    name: "",
    email: "",
    phone: "",
  },
  paymentMethod: "vnpay",
  voucherId: null,
  isReadyForBooking: false,
};

const selectedTripSlice = createSlice({
  name: "selectedTrip",
  initialState,
  reducers: {
    setSelectedTrip: (state, action: PayloadAction<ITripPayload>) => {
      const {
        tripId,
        route,
        busCompanyName,
        tripImage,
        departureTime,
        arrivalTime,
        typeBusName,
        selectedSeats,
        selectedPickUpPoint,
        selectedDropOffPoint,
        totalPrice,
      } = action.payload;
      state.tripId = tripId;
      state.route = route;
      state.tripImage = tripImage;
      state.busCompanyName = busCompanyName;
      state.departureTime = departureTime;
      state.arrivalTime = arrivalTime;
      state.typeBusName = typeBusName;
      state.selectedSeats = selectedSeats;
      state.selectedPickUpPoint = selectedPickUpPoint;
      state.selectedDropOffPoint = selectedDropOffPoint;
      state.totalPrice = totalPrice;
    },

    setUserInformation: (state, action: PayloadAction<IUserInformation>) => {
      const { name, email, phone } = action.payload;
      state.userInformation.name = name;
      state.userInformation.email = email;
      state.userInformation.phone = phone;
    },

    setPaymentMethod: (
      state,
      action: PayloadAction<{
        paymentMethod: string;
        voucherId: string | null;
      }>
    ) => {
      state.paymentMethod = action.payload.paymentMethod;
      state.voucherId = action.payload.voucherId;
    },

    toggleChangeIsReadyForBooking: (state, action: PayloadAction<boolean>) => {
        state.isReadyForBooking = action.payload;
    },

    // Reset selected trip data sau khi thanh toán thành công
    resetSelectedTrip: () => {
      return initialState;
    }
  },
});

export const { setSelectedTrip, setUserInformation, setPaymentMethod, toggleChangeIsReadyForBooking, resetSelectedTrip } =
  selectedTripSlice.actions;

export default selectedTripSlice.reducer;
