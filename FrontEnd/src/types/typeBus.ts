export interface TypeBus {
    id: string;
    name: string;
    totalSeats: number;
    numberRows: number;
    numberCols: number;
    isFloors: boolean;
    numberRowsFloor?: number;
    numberColsFloor?: number;
    seats: Seat[];
}

export interface Seat {
    id: string;
    code: string;
    floor: number;
    indexCol: number;
    indexRow: number;
}