export default interface CompanyTrip {
  id: string;
  templateId?: string;
  busId?: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: boolean;
  busRouteId?: string;
  busRoute?: BusRoute;
  buses?: Bus;
  template?: Template;
}

interface BusRoute {
  id: string;
  routeId: string;
  busCompanyId: string;
  status: boolean;
  route: Route;
}

interface Route {
  id: string;
  startLocationId: string;
  endLocationId: string;
  distanceKm: number;
  status: string;
  createdBy?: string;
  startLocation: Location;
  endLocation: Location;
}

interface Location {
  id: string;
  cityId: string;
  name: string;
  isActive: boolean;
}

interface Bus {
  id: string;
  companyId: string;
  licensePlate: string;
  typeBusId: string;
  images: string[];
  extensions: string[];
  isActive: boolean;
  typeBus: TypeBus;
}

interface TypeBus {
  id: string;
  name: string;
  totalSeats: number;
  numberRows: number;
  numberCols: number;
  isFloors: boolean;
  numberRowsFloor?: number;
  numberColsFloor?: number;
  busCompanyId?: string;
}

interface Template {
  id: string;
  companyId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  busRoutesId: string;
  busId: string;
}