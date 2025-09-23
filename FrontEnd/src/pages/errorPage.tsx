import ErrorImage from "@/assets/error_image.png";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <img className="w-1/2" src={ErrorImage} alt="Error" />
        <Button onClick={() => window.history.back()} className="text-2xl h-auto rounded-2xl mt-4 px-6 py-3 bg-primary text-white hover:bg-primary transition">Quay lại trang trước</Button>
    </div>
  )
}
