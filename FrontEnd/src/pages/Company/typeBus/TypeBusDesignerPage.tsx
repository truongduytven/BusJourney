import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  fetchCompanyTypeBusById,
  createCompanyTypeBus,
  updateCompanyTypeBus,
} from "@/redux/thunks/companyTypeBusThunks";
import { SeatLayoutDesigner } from "./SeatLayoutDesigner";

interface Seat {
  code: string;
  indexCol: number;
  indexRow: number;
  floor: number;
}

export const TypeBusDesignerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEditMode = !!id;

  const [name, setName] = useState("");
  const [isFloors, setIsFloors] = useState(false);
  const [floor1Rows, setFloor1Rows] = useState(4);
  const [floor1Cols, setFloor1Cols] = useState(4);
  const [floor2Rows, setFloor2Rows] = useState(0);
  const [floor2Cols, setFloor2Cols] = useState(0);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadTypeBusData();
    }
  }, [id, isEditMode]);

  const loadTypeBusData = async () => {
    try {
      const result = await dispatch(fetchCompanyTypeBusById(id!)).unwrap();
      
      setName(result.name);
      setIsFloors(result.isFloors);
      setFloor1Rows(result.numberRows);
      setFloor1Cols(result.numberCols);
      setFloor2Rows(result.numberRowsFloor || 0);
      setFloor2Cols(result.numberColsFloor || 0);
      
      const mappedSeats = (result.seat || []).map((seat: any) => ({
        code: seat.code,
        indexCol: seat.indexCol,
        indexRow: seat.indexRow,
        floor: seat.floor,
      }));
      setSeats(mappedSeats);
    } catch (error: any) {
      toast.error(error || "Không thể tải dữ liệu");
      navigate("/company/type-buses");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên loại xe");
      return;
    }

    if (seats.length === 0) {
      toast.error("Vui lòng thiết kế ít nhất 1 ghế");
      return;
    }

    setLoading(true);
    try {
      // Calculate actual dimensions from seats
      const floor1Seats = seats.filter(s => s.floor === 1);
      const floor2Seats = seats.filter(s => s.floor === 2);

      const floor1MaxRow = floor1Seats.length > 0 ? Math.max(...floor1Seats.map(s => s.indexRow)) : floor1Rows;
      const floor1MaxCol = floor1Seats.length > 0 ? Math.max(...floor1Seats.map(s => s.indexCol)) : floor1Cols;
      
      let floor2MaxRow = 0;
      let floor2MaxCol = 0;
      if (isFloors && floor2Seats.length > 0) {
        floor2MaxRow = Math.max(...floor2Seats.map(s => s.indexRow));
        floor2MaxCol = Math.max(...floor2Seats.map(s => s.indexCol));
      }

      const data = {
        name,
        totalSeats: seats.length,
        numberRows: floor1MaxRow,
        numberCols: floor1MaxCol,
        isFloors,
        numberRowsFloor: isFloors && floor2MaxRow > 0 ? floor2MaxRow : undefined,
        numberColsFloor: isFloors && floor2MaxCol > 0 ? floor2MaxCol : undefined,
        seats,
      };

      if (isEditMode) {
        await dispatch(updateCompanyTypeBus({ id: id!, data })).unwrap();
        toast.success("Cập nhật loại xe thành công");
      } else {
        await dispatch(createCompanyTypeBus(data)).unwrap();
        toast.success("Tạo loại xe thành công");
      }

      navigate("/company/type-buses");
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const adjustRows = (floor: 1 | 2, delta: number) => {
    if (floor === 1) {
      const newRows = Math.max(1, floor1Rows + delta);
      setFloor1Rows(newRows);
    } else {
      const newRows = Math.max(1, floor2Rows + delta);
      setFloor2Rows(newRows);
    }
  };

  const adjustCols = (floor: 1 | 2, delta: number) => {
    if (floor === 1) {
      const newCols = Math.max(1, floor1Cols + delta);
      setFloor1Cols(newCols);
    } else {
      const newCols = Math.max(1, floor2Cols + delta);
      setFloor2Cols(newCols);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl max-h-[calc(100vh-80px)] overflow-y-scroll">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/company/type-buses")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {isEditMode ? "Chỉnh sửa loại xe" : "Tạo loại xe mới"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Thiết kế sơ đồ ghế cho loại xe của bạn
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="p-6 h-fit border-neutral-200 bg-white">
          <h2 className="font-semibold mb-4">Cấu hình</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại xe</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Giường nằm 40 chỗ"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="floors">Xe 2 tầng</Label>
              <Switch
                id="floors"
                checked={isFloors}
                onCheckedChange={setIsFloors}
              />
            </div>

            <div className="border-t pt-4 border-neutral-300">
              <h3 className="font-medium mb-3">Tầng 1</h3>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label>Số hàng</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => adjustRows(1, -1)}
                      className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={floor1Rows}
                      onChange={(e) => setFloor1Rows(Number(e.target.value))}
                      className="text-center"
                      min={1}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => adjustRows(1, 1)}
                      className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Số cột</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => adjustCols(1, -1)}
                      className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={floor1Cols}
                      onChange={(e) => setFloor1Cols(Number(e.target.value))}
                      className="text-center"
                      min={1}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => adjustCols(1, 1)}
                      className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {isFloors && (
              <div className="border-t pt-4 border-neutral-300">
                <h3 className="font-medium mb-3">Tầng 2</h3>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label>Số hàng</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustRows(2, -1)}
                        className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={floor2Rows}
                        onChange={(e) => setFloor2Rows(Number(e.target.value))}
                        className="text-center"
                        min={1}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustRows(2, 1)}
                        className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Số cột</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustCols(2, -1)}
                        className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={floor2Cols}
                        onChange={(e) => setFloor2Cols(Number(e.target.value))}
                        className="text-center"
                        min={1}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustCols(2, 1)}
                        className="border-gray-300 cursor-pointer hover:border-primary hover:scale-110 text-primary/70 hover:text-primary"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4 border-neutral-300">
              <div className="text-sm space-y-1">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Sơ đồ:</span>
                  <span className="font-medium">
                    {floor1Rows} x {floor1Cols} {isFloors ? `+ ${floor2Rows} x ${floor2Cols}` : ''}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Tổng ghế:</span>
                  <span className="font-medium">{seats.length}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Seat Layout Designer */}
        <div className="lg:col-span-2">
          <SeatLayoutDesigner
            typeBusName={name}
            floor1Rows={floor1Rows}
            floor1Cols={floor1Cols}
            floor2Rows={floor2Rows}
            floor2Cols={floor2Cols}
            isFloors={isFloors}
            seats={seats}
            onSeatsChange={setSeats}
          />
        </div>
      </div>
    </div>
  );
};
