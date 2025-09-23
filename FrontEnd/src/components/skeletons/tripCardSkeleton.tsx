import { Skeleton } from "../ui/skeleton";

export default function TripCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl mb-4 shadow-md flex flex-col p-4">
      <div className="flex ">
        <Skeleton className="w-54 h-36 object-cover rounded-md" />
        <div className="ml-4 flex flex-col justify-between flex-1">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-48 h-6 rounded-md" />
              <Skeleton className="w-32 h-4 rounded-md" />
              <div className="flex gap-x-2 h-24">
                <div className="flex flex-col text-primary justify-center items-center py-1">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <div className="border-l-2 border-dotted border-gray-300 mx-2 flex-1" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
                <div className="flex flex-col justify-between items-start text-lg text-primary flex-1">
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-y-3">
              <Skeleton className="w-24 h-6 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-12 h-4 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
