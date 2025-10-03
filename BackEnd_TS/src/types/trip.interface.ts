import type { ICoupon } from "../models/Coupon";
import type { IBusCompany } from "../models/BusCompany";
import type { ICompanyPolicy, ICancellationRule } from "../models/CompanyPolicy";
import { IBus } from "../models/Bus";
import { IPoint } from "../models/Point";
import { IReview } from "../models/Reviews";
import { ITypeBus } from "../models/TypeBus";
import { IRoute } from "../models/Route";
import { ILocation } from "../models/Location";
import { ITrip } from "../models/Trip";
import { ISeat } from "../models/Seat";
import { ITicket } from "../models/Ticket";

export interface ITripDetail {
    id: string;
    buses: IBusTrip;
    point: IPoint[];
    avgRating: number | null;
    numberComments: number;
    review: IReviewAccount[];
    route: IRouteTrip;
}

interface IBusTrip extends IBus {
    bus_companies: IBusCompanyTrip;
    type_buses: ITypeBus;
}

interface IBusCompanyTrip extends IBusCompany {
    coupons: ICoupon[];
    policies?: ICompanyPolicy[];
    cancellationRules?: ICancellationRule[];
}

interface IReviewAccount extends IReview {
    account: {
        id: string;
        name: string;
        avatar: string;
    };
}

interface IRouteTrip extends IRoute {
    startLocation: ILocation;
    endLocation: ILocation;
}

export interface IGetListTrip extends ITrip {
    buses: IBusData;
    ticket: ITicket[];
    point: IPoint[];
}

interface IBusData extends IBus {
    type_buses: ITypeBusData;
}

interface ITypeBusData extends ITypeBus {
    seat: ISeat[];
}