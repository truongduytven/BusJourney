import type { IPoint, ISeat } from "./trip";

export interface InformationCheckout extends ITripPayload {
  userInformation: IUserInformation;
  paymentMethod: string;
  voucherId: string | null;
  isReadyForBooking: boolean;
}

export interface IUserInformation {
  name: string;
  email: string;
  phone: string;
}

export interface ITripPayload extends ITripData {
  selectedSeats: ISeat[];
  selectedPickUpPoint?: IPoint;
  selectedDropOffPoint?: IPoint;
  totalPrice: number;
}

export interface ITripData {
    tripId: string;
    route: string;
    tripImage: string;
    busCompanyName: string;
    departureTime: Date;
    arrivalTime: Date;
    typeBusName: string;
}