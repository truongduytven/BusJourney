import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface ImageSectionProps {
  listImage?: string[];
}

export default function ImageSection({ listImage }: ImageSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!api) return;
    const updateIndex = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", updateIndex);
    return () => {
      api.off("select", updateIndex);
    };
  }, [api]);
  return (
    <div className="flex flex-col items-center w-full">
      <Carousel
        className="w-3/4"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent className="py-3">
          {listImage?.map((image, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="flex justify-center">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-[428px] h-80 rounded-md object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="cursor-pointer text-gray-500 border-gray-500" />
        <CarouselPrevious className="cursor-pointer text-gray-500 border-gray-500" />
      </Carousel>
      {/* <div className="flex gap-x-4 w-full overflow-x-scroll mt-10">
        {listImage?.concat(listImage).map((image, index) => (
          <img
            src={image}
            alt={`Thumbnail ${index + 1}`}
            key={index}
            className="min-w-24 h-24 object-cover rounded-md cursor-pointer"
          />
        ))}
      </div> */}
      <div className="mt-4 flex gap-2 w-4/5 overflow-x-auto">
        {listImage?.map((src, index) => (
          <div
            key={index}
            className={`min-w-24 h-24 cursor-pointer rounded overflow-hidden border-2 p-1 ${
              selectedIndex === index
                ? "border-secondary"
                : "border-transparent"
            }`}
            onClick={() => api?.scrollTo(index)}
          >
            <img
              src={src}
              alt={`thumb-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
