import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Armchair, X, BedDouble } from "lucide-react";

interface Seat {
  code: string;
  indexCol: number;
  indexRow: number;
  floor: number;
}

interface SeatLayoutDesignerProps {
  typeBusName?: string; // Name of the type bus to detect "giường"
  floor1Rows: number;
  floor1Cols: number;
  floor2Rows: number;
  floor2Cols: number;
  isFloors: boolean;
  seats: Seat[];
  onSeatsChange: (seats: Seat[]) => void;
}

export const SeatLayoutDesigner = ({
  typeBusName = "",
  floor1Rows,
  floor1Cols,
  floor2Rows,
  floor2Cols,
  isFloors,
  seats,
  onSeatsChange,
}: SeatLayoutDesignerProps) => {
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [isInitialized, setIsInitialized] = useState(false);

  const isBedBus = typeBusName.toLowerCase().includes("giường");
  const SeatIcon = isBedBus ? BedDouble : Armchair;
  const seatLabel = isBedBus ? "Giường" : "Ghế";
  const seatType = isBedBus ? "giường" : "ghế";

  useEffect(() => {
    if (!isInitialized && seats.length === 0) {
      generateDefaultSeats();
      setIsInitialized(true);
    } else if (seats.length > 0 && !isInitialized) {
      setIsInitialized(true);
    }
  }, [seats, isInitialized]);

  useEffect(() => {
    if (isInitialized && seats.length === 0) {
      generateDefaultSeats();
    }
  }, [floor1Rows, floor1Cols, floor2Rows, floor2Cols, isFloors]);

  const generateDefaultSeats = () => {
    const newSeats: Seat[] = [];

    for (let row = 1; row <= floor1Rows; row++) {
      for (let col = 1; col <= floor1Cols; col++) {
        if (row === 1 && col === 1) {
          continue;
        }
        newSeats.push({
          code: "temp",
          indexCol: col,
          indexRow: row,
          floor: 1,
        });
      }
    }

    if (isFloors) {
      for (let row = 1; row <= floor2Rows; row++) {
        for (let col = 1; col <= floor2Cols; col++) {
          newSeats.push({
            code: "temp",
            indexCol: col,
            indexRow: row,
            floor: 2,
          });
        }
      }
    }


    const recalculatedSeats = recalculateSeatCodes(newSeats);
    onSeatsChange(recalculatedSeats);
  };

  const getSeatAtPosition = (floor: number, row: number, col: number) => {
    return seats.find(
      (s) => s.floor === floor && s.indexRow === row && s.indexCol === col
    );
  };

  const toggleSeat = (floor: number, row: number, col: number) => {
    if (floor === 1 && row === 1 && col === 1) {
      return;
    }

    const existingSeat = getSeatAtPosition(floor, row, col);

    let updatedSeats: Seat[];
    if (existingSeat) {
      // Remove seat
      updatedSeats = seats.filter(
        (s) =>
          !(s.floor === floor && s.indexRow === row && s.indexCol === col)
      );
    } else {
      // Add new seat (temporary code, will be recalculated)
      updatedSeats = [
        ...seats,
        {
          code: "temp",
          indexCol: col,
          indexRow: row,
          floor,
        },
      ];
    }

    // Recalculate all seat codes based on position order
    const recalculatedSeats = recalculateSeatCodes(updatedSeats);
    onSeatsChange(recalculatedSeats);
  };

  const recalculateSeatCodes = (seatList: Seat[]): Seat[] => {
    // Sort seats by floor, then row, then column
    const sortedSeats = [...seatList].sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      if (a.indexRow !== b.indexRow) return a.indexRow - b.indexRow;
      return a.indexCol - b.indexCol;
    });

    // Reassign codes based on sorted order
    let floor1Counter = 1;
    let floor2Counter = 1;

    return sortedSeats.map((seat) => {
      if (seat.floor === 1) {
        const code = `A${floor1Counter.toString().padStart(2, "0")}`;
        floor1Counter++;
        return { ...seat, code };
      } else {
        const code = `B${floor2Counter.toString().padStart(2, "0")}`;
        floor2Counter++;
        return { ...seat, code };
      }
    });
  };

  const renderFloor = (
    floorNumber: 1 | 2,
    rows: number,
    cols: number
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            Tầng {floorNumber} - {rows} x {cols}
          </h3>
          <div className="flex gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>{seatLabel} thường</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded" />
              <span>Trống</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg overflow-auto">
          <div className="inline-block">
            {/* Driver seat indicator */}
            <div className="flex items-center gap-2 mb-4 ml-2">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                <Armchair className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Ghế tài xế</span>
            </div>

            {/* Seat grid */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {Array.from({ length: rows }, (_, rowIndex) =>
                Array.from({ length: cols }, (_, colIndex) => {
                  const row = rowIndex + 1;
                  const col = colIndex + 1;
                  const seat = getSeatAtPosition(floorNumber, row, col);
                  const isDriverSeat = floorNumber === 1 && row === 1 && col === 1;

                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => toggleSeat(floorNumber, row, col)}
                      disabled={isDriverSeat}
                      className={cn(
                        "w-16 h-16 rounded-lg border-2 transition-all relative",
                        "flex flex-col items-center justify-center gap-1",
                        isDriverSeat
                          ? "bg-yellow-500 border-yellow-600 cursor-not-allowed"
                          : seat
                          ? "bg-blue-500 border-blue-600 hover:bg-blue-600 cursor-pointer"
                          : "bg-gray-200 border-gray-300 hover:bg-gray-300 cursor-pointer"
                      )}
                    >
                      {isDriverSeat ? (
                        <Armchair className="w-6 h-6 text-white" />
                      ) : seat ? (
                        <>
                          <SeatIcon
                            className={cn(
                              "w-5 h-5",
                              seat ? "text-white" : "text-gray-500"
                            )}
                          />
                          <span className="text-xs font-medium text-white">
                            {seat.code}
                          </span>
                        </>
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="absolute top-0.5 right-1 text-[10px] text-gray-500">
                        {row},{col}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 border-neutral-200 shadow-xl">
      <h2 className="font-semibold">Thiết kế sơ đồ {seatType}</h2>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Hướng dẫn:</strong> Click vào ô để thêm/xóa {seatType}. Ghế tài xế (hàng 1, cột 1) không thể thay đổi.
        </p>
      </div>

      {isFloors ? (
        <Tabs value={activeFloor.toString()} onValueChange={(v) => setActiveFloor(Number(v) as 1 | 2)}>
          <TabsList className="mb-4">
            <TabsTrigger value="1">Tầng 1</TabsTrigger>
            <TabsTrigger value="2">Tầng 2</TabsTrigger>
          </TabsList>
          <TabsContent value="1">
            {renderFloor(1, floor1Rows, floor1Cols)}
          </TabsContent>
          <TabsContent value="2">
            {renderFloor(2, floor2Rows, floor2Cols)}
          </TabsContent>
        </Tabs>
      ) : (
        renderFloor(1, floor1Rows, floor1Cols)
      )}
    </Card>
  );
};
