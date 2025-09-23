import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Divider from "@/components/ui/diviver";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TypeBus, TypeCompany } from "@/types/trip";
import { convertMoney } from "@/utils";
import { ChevronsUpDown, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Range } from "react-range";

interface SlidenavProps {
  dataSort: String | null;
  onSort?: (item: string) => void;
  onClear?: () => void;
  listTypebus?: TypeBus[];
  filterTypebus?: string[] | null;
  selectTypeBus?: (item: string) => void;
  listCompany?: TypeCompany[];
  filterCompany?: string[] | null;
  selectCompany?: (item: string) => void;
  range: number[];
  setRange: (value: number[]) => void;
}

export default function Slidenav({
  dataSort,
  onSort,
  onClear,
  listTypebus,
  filterTypebus,
  selectTypeBus,
  listCompany,
  filterCompany,
  selectCompany,
  range,
  setRange,
}: SlidenavProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      if (draggingIndex !== null) {
        console.log("Call API với giá trị:", range);
        setDraggingIndex(null);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [draggingIndex, range]);
  return (
    <div className="flex flex-col flex-1 py-6 pr-4 gap-y-0.5 h-fit">
      {((filterCompany && filterCompany.length > 0) ||
        (filterTypebus && filterTypebus.length > 0) ||
        (dataSort && dataSort !== "default")) && (
        <div
          onClick={onClear}
          className="flex justify-between mb-5 items-center rounded-2xl p-4 shadow-lg bg-white cursor-pointer"
        >
          <div className="text-secondary font-semibold text-lg">Xóa bộ lọc</div>
          <Trash2 className="text-secondary" size={20} />
        </div>
      )}
      <div className="flex flex-col mb-5 shadow-lg rounded-2xl bg-white">
        <Collapsible
          defaultOpen
          className="flex flex-col rounded-2xl px-4 py-6 gap-y-6"
        >
          <CollapsibleTrigger className="w-full flex justify-between items-center">
            <div className="text-primary font-bold text-lg">Sắp xếp</div>
            <ChevronsUpDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <RadioGroup onValueChange={onSort} defaultValue="default">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "default"}
                  value="default"
                  id="option-one"
                />
                <Label className="font-normal text-base" htmlFor="option-one">
                  Mặc định
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "price_asc"}
                  value="price_asc"
                  id="option-two"
                />
                <Label className="font-normal text-base" htmlFor="option-two">
                  Giá từ thấp đến cao
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "price_desc"}
                  value="price_desc"
                  id="option-three"
                />
                <Label className="font-normal text-base" htmlFor="option-three">
                  Giá từ cao đến thấp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "early"}
                  value="early"
                  id="option-four"
                />
                <Label className="font-normal text-base" htmlFor="option-four">
                  Giờ sớm nhất
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "late"}
                  value="late"
                  id="option-five"
                />
                <Label className="font-normal text-base" htmlFor="option-five">
                  Giờ muộn nhất
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "high_rate"}
                  value="high_rate"
                  id="option-six"
                />
                <Label className="font-normal text-base" htmlFor="option-six">
                  Đánh giá cao nhất
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  checked={dataSort === "low_rate"}
                  value="low_rate"
                  id="option-seven"
                />
                <Label className="font-normal text-base" htmlFor="option-seven">
                  Đánh giá thấp nhất
                </Label>
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
        <Divider />
        <Collapsible className="flex flex-col px-4 py-6 gap-y-6">
          <CollapsibleTrigger className="w-full flex justify-between items-center">
            <div className="text-primary font-bold text-lg">Nhà xe</div>
            <ChevronsUpDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-y-3">
            <Input placeholder="Tìm nhà xe" className="mb-3 border-gray-300" />
            <div className="flex flex-col gap-y-3 max-h-60 overflow-y-auto pr-2">
              {listCompany &&
                listCompany.length > 0 &&
                listCompany.map((company) => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filterCompany?.includes(company.id)}
                      id={`option-${company.id}`}
                      onCheckedChange={() => selectCompany?.(company.id)}
                    />
                    <Label
                      className="font-normal text-base"
                      htmlFor={`option-${company.id}`}
                    >
                      {company.name} ({company.quantity})
                    </Label>
                  </div>
                ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Divider />
        <Collapsible className="flex flex-col px-4 py-6 gap-y-6">
          <CollapsibleTrigger className="w-full flex justify-between items-center">
            <div className="text-primary font-bold text-lg">Loại xe</div>
            <ChevronsUpDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-y-3">
            {listTypebus &&
              listTypebus.length > 0 &&
              listTypebus.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filterTypebus?.includes(type.id)}
                    id={`option-${type.id}`}
                    onCheckedChange={() => selectTypeBus?.(type.id)}
                  />
                  <Label
                    className="font-normal text-base"
                    htmlFor={`option-${type.id}`}
                  >
                    {type.name} ({type.quantity})
                  </Label>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>
        <Divider />
        <Collapsible className="flex flex-col px-4 py-6 gap-y-6">
          <CollapsibleTrigger className="w-full flex justify-between items-center">
            <div className="text-primary font-bold text-lg">Giá vé</div>
            <ChevronsUpDown size={20} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-y-3 mt-4 items-center">
            <Range
              step={1}
              min={0}
              max={2000}
              values={range}
              onChange={setRange}
              renderTrack={({ props, children }) => {
                const { ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    className="h-2 w-10/12 rounded-full bg-gray-200 relative"
                  >
                    {/* colored active part */}
                    <div
                      className="absolute h-2 rounded-full bg-secondary"
                      style={{
                        left: `${(range[0] / 2000) * 100}%`,
                        width: `${((range[1] - range[0]) / 2000) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                );
              }}
              renderThumb={({ props, index }) => (
                <div
                  {...props}
                  className="h-5 w-5 bg-white border border-gray-400 rounded-full shadow flex items-center justify-center relative"
                  onMouseDown={() => setDraggingIndex(index)}
                  onMouseUp={() => setDraggingIndex(null)}
                  onTouchStart={() => setDraggingIndex(index)}
                  onTouchEnd={() => setDraggingIndex(null)}
                >
                  {draggingIndex === index && (
                    <div className="absolute -top-8 px-2 py-1 text-xs text-white bg-black rounded">
                      {convertMoney(range[index] * 1000)}
                    </div>
                  )}
                </div>
              )}
            />
            <div className="flex justify-between w-full mt-2 pl-5">
              <span className="text-sm text-gray-500">{convertMoney(0)}</span>
              <span className="text-sm text-gray-500">
                {convertMoney(2000000)}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
