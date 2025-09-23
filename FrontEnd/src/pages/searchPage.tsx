import SearchForm from "@/components/common/searchForm";
import TripCard from "@/components/common/tripCard";
import Container from "@/components/layout/container";
import Slidenav from "@/components/pages/SearchPage/slidenav";
import TripCardSkeleton from "@/components/skeletons/tripCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  SheetContent,
  SheetTrigger,
  Sheet,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchTrips } from "@/redux/slices/tripSlice";
import { fetchTypeBuses } from "@/redux/slices/typeBusSlice";
import { Funnel, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import NoTripImage from "@/assets/no_trip.png";

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector((state) => state.trips);

  //Pagination
  const [page, setPage] = useState(
    localStorage.getItem("tripSearch")
      ? JSON.parse(localStorage.getItem("tripSearch") || "{}").pageNumber
      : 1
  );
  const handleSelectPage = (pageNumber: number) => {
    const payload = localStorage.getItem("tripSearch");
    if (payload) {
      const parsedPayload = JSON.parse(payload);
      parsedPayload.pageNumber = pageNumber;
      localStorage.setItem("tripSearch", JSON.stringify(parsedPayload));
      dispatch(fetchTrips(parsedPayload));
      setPage(pageNumber);
    }
  };

  //Sort
  const [dataSort, setDataSort] = useState<string | null>(
    localStorage.getItem("tripSearch")
      ? JSON.parse(localStorage.getItem("tripSearch") || "{}").sort
      : "default"
  );
  const selectDataSort = (item: string) => {
    if (item === dataSort) {
      return;
    } else {
      setDataSort(item);
      localStorage.getItem("tripSearch");
      const payload = localStorage.getItem("tripSearch");
      if (payload) {
        const parsedPayload = JSON.parse(payload);
        parsedPayload.sort = item;
        parsedPayload.pageNumber = 1;
        localStorage.setItem("tripSearch", JSON.stringify(parsedPayload));
        dispatch(fetchTrips(parsedPayload));
        setPage(1);
      }
    }
  };
  const showNameSort = (sort: string) => {
    switch (sort) {
      case "price_asc":
        return "Giá từ thấp đến cao";
      case "price_desc":
        return "Giá từ cao đến thấp";
      case "early":
        return "Giờ sớm nhất";
      case "late":
        return "Giờ muộn nhất";
      case "high_rate":
        return "Đánh giá cao nhất";
      case "low_rate":
        return "Đánh giá thấp nhất";
      default:
        return "Mặc định";
    }
  };

  //Filter type bus
  const [filterTypebus, setFilterTypebus] = useState<string[] | null>(
    localStorage.getItem("tripSearch")
      ? JSON.parse(localStorage.getItem("tripSearch") || "{}").typeBus
      : []
  );
  const selectTypeBus = (item: string) => {
    let newTypeBus = filterTypebus ? [...filterTypebus] : [];
    if (newTypeBus.includes(item)) {
      newTypeBus = newTypeBus.filter((i) => i !== item);
    } else {
      newTypeBus.push(item);
    }
    setFilterTypebus(newTypeBus);
    const payload = JSON.parse(localStorage.getItem("tripSearch") || "{}");
    if (payload) {
      const updatedPayload = {
        ...payload,
        typeBus: newTypeBus,
        pageNumber: 1,
      };
      localStorage.setItem("tripSearch", JSON.stringify(updatedPayload));
      dispatch(fetchTrips(updatedPayload));
      setPage(1);
    }
  };

  //Filter company
  const [filterCompany, setFilterCompany] = useState<string[] | null>(
    localStorage.getItem("tripSearch")
      ? JSON.parse(localStorage.getItem("tripSearch") || "{}").companiesId
      : []
  );

  const selectCompany = (item: string) => {
    let newCompany = filterCompany ? [...filterCompany] : [];
    if (newCompany.includes(item)) {
      newCompany = newCompany.filter((i) => i !== item);
    } else {
      newCompany.push(item);
    }
    setFilterCompany(newCompany);
    const payload = JSON.parse(localStorage.getItem("tripSearch") || "{}");
    if (payload) {
      const updatedPayload = {
        ...payload,
        companiesId: newCompany,
        pageNumber: 1,
      };
      localStorage.setItem("tripSearch", JSON.stringify(updatedPayload));
      dispatch(fetchTrips(updatedPayload));
      setPage(1);
    }
  };
  //Filter range price
  const [range, setRange] = useState([0, 2000]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const payload = JSON.parse(localStorage.getItem("tripSearch") || "{}");
      if (payload) {
        const updatedPayload = {
          ...payload,
          minPrice: range[0] * 1000,
          maxPrice: range[1] * 1000,
          pageNumber: 1,
        };
        localStorage.setItem("tripSearch", JSON.stringify(updatedPayload));
        dispatch(fetchTrips(updatedPayload));
        setPage(1);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [range]);



  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTypeBuses());
  }, [dispatch]);

  useEffect(() => {
    const payload = localStorage.getItem("tripSearch");
    if (payload) {
      dispatch(fetchTrips(JSON.parse(payload)));
    }
  }, [dispatch]);

  const clearFilter = () => {
    setDataSort("default");
    setFilterTypebus([]);
    setFilterCompany([]);
    const payload = JSON.parse(localStorage.getItem("tripSearch") || "{}");
    const updatedPayload = {
      ...payload,
      sort: "default",
      typeBus: [],
      companiesId: [],
      pageNumber: 1,
    };
    localStorage.setItem("tripSearch", JSON.stringify(updatedPayload));
    dispatch(fetchTrips(updatedPayload));
    setPage(1);
    localStorage.removeItem("dataSort");
  };

  return (
    <div className="bg-gray-100 w-full">
      <Container>
        <div className="flex flex-col w-full items-center justify-center">
          <div className="w-full flex justify-center mb-6 mt-16">
            <SearchForm className="w-full" />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <div className="w-3/4 p-6 flex md:hidden justify-between items-center bg-white text-xl font-semibold rounded-2xl shadow-md">
                <div>Bộ lọc</div>
                <Funnel />
              </div>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-white overflow-y-scroll"
            >
              <Slidenav
                listTypebus={list?.listBus || []}
                selectTypeBus={selectTypeBus}
                filterTypebus={filterTypebus}
                listCompany={list?.listCompany || []}
                selectCompany={selectCompany}
                filterCompany={filterCompany}
                range={range}
                setRange={setRange}
                dataSort={dataSort}
                onSort={selectDataSort}
                onClear={clearFilter}
              />
              <SheetFooter>
                <SheetClose>
                  <Button
                    className="w-60 border-secondary text-secondary"
                    variant="outline"
                  >
                    Xóa bộ lọc
                  </Button>
                </SheetClose>
                <SheetClose>
                  <Button
                    className="w-60 bg-primary text-white"
                    variant="outline"
                  >
                    Đóng
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <div className="w-full min-h-[70vh] rounded-2xl flex flex-col md:flex-row gap-2 gap-x-4">
            <div className="hidden md:block w-1/4 sticky top-24 h-fit">
              <Slidenav
                listTypebus={list?.listBus || []}
                selectTypeBus={selectTypeBus}
                filterTypebus={filterTypebus}
                listCompany={list?.listCompany || []}
                selectCompany={selectCompany}
                filterCompany={filterCompany}
                range={range}
                setRange={setRange}
                dataSort={dataSort}
                onSort={selectDataSort}
                onClear={clearFilter}
              />
            </div>
            <div className="flex-1 py-10 md:py-6 text-primary flex flex-col">
              {(list?.data.length || 0) > 0 && (
                <div className="text-2xl font-bold mb-4">
                  Kết quả: {list?.data.length || 0} chuyến xe
                </div>
              )}
              <div className="flex items-center rounded-2xl flex-wrap mb-4">
                {filterTypebus &&
                  filterTypebus.length > 0 &&
                  filterTypebus.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => selectTypeBus(item)}
                      className="bg-primary/60 text-white/80 px-3 text-sm py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-primary/80 hover:text-white transition flex items-center gap-x-2"
                    >
                      {list?.listBus.find((bus) => bus.id === item)?.name}{" "}
                      <X size={16} />
                    </div>
                  ))}
                {dataSort && dataSort !== "default" && (
                  <div
                    key={dataSort}
                    onClick={() => selectDataSort("default")}
                    className="bg-primary/60 text-white/80 px-3 text-sm py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-primary/80 hover:text-white transition flex items-center gap-x-2"
                  >
                    {showNameSort(dataSort)} <X size={16} />
                  </div>
                )}
                {filterCompany &&
                  filterCompany.length > 0 &&
                  filterCompany.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => selectCompany(item)}
                      className="bg-primary/60 text-white/80 px-3 text-sm py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-primary/80 hover:text-white transition flex items-center gap-x-2"
                    >
                      {
                        list?.listCompany.find((company) => company.id === item)
                          ?.name
                      }{" "}
                      <X size={16} />
                    </div>
                  ))}
              </div>
              {status === "loading" ? (
                <div className="w-full flex flex-col gap-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <TripCardSkeleton key={item} />
                  ))}
                </div>
              ) : list && list.data.length > 0 ? (
                <div className="w-full flex flex-col gap-y-4">
                  {list?.data.map((item) => (
                    <TripCard
                      key={item.id}
                      item={item}
                      selectedTrip={selectedTrip}
                      setSelectedTrip={setSelectedTrip}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-y-4 text-center text-lg text-gray-500">
                  <img
                    src={NoTripImage}
                    alt="No Trip Found"
                    className="w-44 h-40"
                  />
                  <div className="font-semibold">
                    Không tìm thấy chuyến xe nào
                  </div>
                </div>
              )}
              {status != "loading" && list && list.totalPages > 1 && (
                <Pagination className="w-full mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      {page > 1 && (
                        <PaginationPrevious
                          onClick={() => handleSelectPage(page - 1)}
                        />
                      )}
                    </PaginationItem>
                    {list &&
                      Array.from({
                        length: list.totalPages,
                      }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handleSelectPage(index + 1)}
                            isActive={page === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    <PaginationItem>
                      {list && page < list.totalPages && (
                        <PaginationNext
                          onClick={() => handleSelectPage(page + 1)}
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
