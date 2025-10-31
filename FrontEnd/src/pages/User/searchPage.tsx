import SearchForm from "@/components/forms/searchForm";
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
import { fetchTrips } from "@/redux/thunks/tripThunks";
import { Funnel, X } from "lucide-react";
import { useEffect, useState } from "react";
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
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 w-full pt-10 min-h-screen">
      <Container>
        <div className="flex flex-col w-full items-center justify-center">
          {/* Search Form with Animation */}
          <div className="w-full flex justify-center mb-6 mt-16 animate-fade-in-down">
            <SearchForm className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300" />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="w-3/4 p-6 flex md:hidden justify-between items-center bg-white text-xl font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group animate-slide-in-left">
                <div className="group-hover:text-primary transition-colors">Bộ lọc</div>
                <Funnel className="group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
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
            {/* Sidebar Filter - Desktop */}
            <div className="hidden md:block w-1/4 sticky top-24 h-fit animate-slide-in-left">
              <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
            </div>
            
            {/* Main Content */}
            <div className="flex-1 py-10 md:py-6 text-primary flex flex-col">
              {/* Result Count with Animation */}
              {((list?.data.length || 0) > 0 && status !== "loading") && (
                <div className="text-2xl font-bold mb-4 animate-fade-in-up">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Kết quả:
                  </span>{" "}
                  <span className="inline-block animate-count-up">
                    {list?.data.length || 0}
                  </span>{" "}
                  chuyến xe
                </div>
              )}
              
              {/* Active Filters */}
              <div className="flex items-center rounded-2xl flex-wrap mb-4">
                {filterTypebus &&
                  filterTypebus.length > 0 &&
                  filterTypebus.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => selectTypeBus(item)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 text-sm py-2 rounded-full mr-2 mb-2 cursor-pointer hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-x-2 animate-fade-in-scale group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {list?.listBus.find((bus) => bus.id === item)?.name}{" "}
                      <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                  ))}
                {dataSort && dataSort !== "default" && (
                  <div
                    key={dataSort}
                    onClick={() => selectDataSort("default")}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 text-sm py-2 rounded-full mr-2 mb-2 cursor-pointer hover:from-purple-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-x-2 animate-fade-in-scale group"
                  >
                    {showNameSort(dataSort)} <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                )}
                {filterCompany &&
                  filterCompany.length > 0 &&
                  filterCompany.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => selectCompany(item)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 text-sm py-2 rounded-full mr-2 mb-2 cursor-pointer hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-x-2 animate-fade-in-scale group"
                      style={{ animationDelay: `${(filterTypebus?.length || 0) * 0.05 + index * 0.05}s` }}
                    >
                      {
                        list?.listCompany.find((company) => company.id === item)
                          ?.name
                      }{" "}
                      <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                  ))}
              </div>
              {/* Trip Cards or Loading State */}
              {status === "loading" ? (
                <div className="w-full flex flex-col gap-y-4">
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <div
                      key={item}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TripCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : list && list.data.length > 0 ? (
                <div className="w-full flex flex-col gap-y-4">
                  {list?.data.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-scale hover:animate-pulse-subtle"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <TripCard
                        item={item}
                        selectedTrip={selectedTrip}
                        setSelectedTrip={setSelectedTrip}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-y-4 text-center text-lg text-gray-500 animate-fade-in-up">
                  <img
                    src={NoTripImage}
                    alt="No Trip Found"
                    className="w-44 h-40 animate-float opacity-70"
                  />
                  <div className="font-semibold text-xl">
                    Không tìm thấy chuyến xe nào
                  </div>
                  <p className="text-sm text-gray-400 max-w-md">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với các tiêu chí khác
                  </p>
                </div>
              )}
              {/* Pagination with Animation */}
              {status != "loading" && list && list.totalPages > 1 && (
                <Pagination className="w-full mt-6 animate-fade-in-up">
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      {page > 1 && (
                        <PaginationPrevious
                          onClick={() => handleSelectPage(page - 1)}
                          className="hover:scale-110 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
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
                            className={`hover:scale-110 transition-all duration-300 cursor-pointer ${
                              page === index + 1
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    <PaginationItem>
                      {list && page < list.totalPages && (
                        <PaginationNext
                          onClick={() => handleSelectPage(page + 1)}
                          className="hover:scale-110 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              <div className="h-[50vh]"/>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
