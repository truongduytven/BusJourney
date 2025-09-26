import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import type { City } from "@/types/city";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRightLeft,
  CalendarFold,
  ChevronDownIcon,
  MapPin,
  MapPinHouse,
  Search,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Calendar } from "../ui/calendar";
import { vi } from "date-fns/locale/vi";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { fetchTrips } from "@/redux/slices/tripSlice";

interface SearchFormProps {
  className?: string;
}

export default function SearchForm({ className }: SearchFormProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const storedDateStr = localStorage.getItem("date");
    if (storedDateStr) {
      const storedDate = new Date(storedDateStr);
      storedDate.setHours(storedDate.getHours() - 7, storedDate.getMinutes(), 0, 0);
      return storedDate < new Date() ? new Date() : storedDate;
    }
    return new Date();
  });
  const cities = useAppSelector((state) => state.cities.list) || [];
  const status = useAppSelector((state) => state.cities.status);
  const [fromCity, setFromCity] = useState<string | null>(null);
  const [toCity, setToCity] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fromCity && localStorage.setItem("fromCity", fromCity);
    toCity && localStorage.setItem("toCity", toCity);
    if (date && date.getDay() === new Date().getDay()) {
      const dateNow = new Date();
      date && localStorage.setItem("date", dateNow.toISOString());
    } else {
      date && localStorage.setItem("date", date.toISOString());
    }
  }, [fromCity, toCity, date]);

  useEffect(() => {
    if (
      cities.length > 0 &&
      cities.find((c: City) => c.id === localStorage.getItem("fromCity"))
    ) {
      setFromCity(localStorage.getItem("fromCity"));
    }
    if (
      cities.length > 0 &&
      cities.find((c: City) => c.id === localStorage.getItem("toCity"))
    ) {
      setToCity(localStorage.getItem("toCity"));
    }
  }, [cities]);

  const handleSearch = () => {
    if (!fromCity || !toCity || !date) return;

    const searchPayload = {
      fromCityId: fromCity,
      toCityId: toCity,
      departureDate: localStorage.getItem("date") || new Date().toISOString(),
      sort: "default",
      pageNumber: 1,
      pageSize: 10,
    };

    localStorage.setItem("tripSearch", JSON.stringify(searchPayload));

    if (pathname === "/") {
      navigate("/search");
    } else {
      dispatch(fetchTrips(searchPayload));
    }
  };

  const changeValue = () => {
    const flag = fromCity;
    setFromCity(toCity);
    setToCity(flag);
  };

  const formatDate = (date: Date) => {
    const dayString = date.toLocaleDateString().split("/");

    return `${dayString[1].padStart(2, "0")}/${dayString[0].padStart(2, "0")}/${dayString[2]}`;
  }

  return (
    <Card
      className={cn(
        "shadow-lg rounded-2xl bg-white border-none w-3/4 px-6",
        className
      )}
    >
      <CardContent className="flex flex-col md:flex-row justify-between items-center px-0 gap-y-4 md:gap-y-0">
        <div className="text-2xl font-bold text-center text-primary">
          Tìm chuyến xe của bạn
        </div>
        <div className="flex gap-2 text-gray-400">
          <div>Bạn cần giúp đỡ?</div>
          <div className="hover:underline cursor-pointer">
            Hỗ trợ với trợ lý ảo
          </div>
        </div>
      </CardContent>
      <CardContent className="flex flex-col md:flex-row items-center gap-4 border rounded-xl p-5 border-gray-200 gap-y-4 md:gap-y-0">
        <div className="flex relative justify-center flex-1 border-r border-gray-200">
          <Button
            size="icon"
            className="absolute -bottom-10 md:top-3/12 -right-4.5 text-gray-400 bg-white border border-gray-400 rounded-full hover:text-white"
            onClick={changeValue}
          >
            <ArrowRightLeft />
          </Button>
          <div className="flex flex-col gap-2 px-6 w-60">
            <div className="flex gap-2 font-semibold text-lg items-center text-gray-500">
              Điểm đi
            </div>
            <div className="flex items-center">
              <MapPinHouse className="text-secondary" />
              <Select
                value={fromCity ?? ""}
                onValueChange={(value) => setFromCity(value)}
              >
                <SelectTrigger className="outline-none border-none border-0 cursor-pointer focus-visible:border-none shadow-none text-base font-semibold text-primary focus-visible:ring-0">
                  <SelectValue
                    placeholder={
                      status === "loading" ? "Đang tải..." : "Chọn điểm đi"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.length > 0 ? (
                    [...cities]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c: City) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                          className="cursor-pointer"
                        >
                          {c.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem disabled value="a">
                      Không có thành phố nào
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-1 border-r border-gray-200">
          <div className="flex flex-col gap-2 px-6 w-60">
            <div className="flex gap-2 font-semibold text-lg items-center text-gray-500">
              Điểm đến
            </div>
            <div className="flex w-full items-center">
              <MapPin className="text-secondary" />
              <Select
                value={toCity ?? ""}
                onValueChange={(value) => setToCity(value)}
              >
                <SelectTrigger className="border-none border-0 cursor-pointer focus-visible:border-none shadow-none text-base font-semibold text-primary focus-visible:ring-0">
                  <SelectValue
                    placeholder={
                      status === "loading" ? "Đang tải..." : "Chọn điểm đến"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.length > 0 ? (
                    [...cities]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((c: City) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                          className="cursor-pointer"
                        >
                          {c.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem disabled value="a">
                      Không có thành phố nào
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-1 border-r border-gray-200">
          <div className="flex flex-col gap-2 px-6 w-60">
            <div className="flex gap-2 font-semibold text-lg items-center text-gray-500">
              Ngày đi
            </div>
            <div className="flex w-full items-center">
              <CalendarFold className="text-secondary" />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between cursor-pointer border-none shadow-none text-base font-semibold text-primary"
                  >
                    {date ? formatDate(date) : "Chọn ngày đi"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    locale={vi}
                    captionLayout="dropdown"
                    disabled={{ before: new Date() }}
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex-1 text-center mt-6 md:mt-0">
          <Button
            onClick={handleSearch}
            disabled={!fromCity || !toCity || !date}
            className="text-white text-lg py-3 w-34 h-auto rounded-4xl cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <Search /> Tìm vé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
