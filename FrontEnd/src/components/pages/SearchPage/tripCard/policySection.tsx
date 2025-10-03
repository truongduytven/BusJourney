import type { ICancellationRule, ICompanyPolicy } from "@/types/trip";
import { AlertTriangle } from "lucide-react";

interface PolicySectionProps {
  cancellationRules: ICancellationRule[] | undefined;
  companyPolicies: ICompanyPolicy[] | undefined;
}

export default function PolicySection({
  cancellationRules,
  companyPolicies,
}: PolicySectionProps) {
  //   "cancellationRules": [
  //   {
  //     "id": "3cde79ff-30cd-4411-8ffb-8606f9958093",
  //     "timeBeforeDeparture": 48,
  //     "refundPercentage": "100.00",
  //     "feeAmount": "0.00"
  //   },
  //   {
  //     "id": "a6b4b72b-7caf-46ea-b202-8289fdd064c7",
  //     "timeBeforeDeparture": 24,
  //     "refundPercentage": "70.00",
  //     "feeAmount": "0.00"
  //   },
  //   {
  //     "id": "3fda8c7d-b0a5-4ae8-93d3-3b0fd31f7f54",
  //     "timeBeforeDeparture": 6,
  //     "refundPercentage": "30.00",
  //     "feeAmount": "0.00"
  //   },
  //   {
  //     "id": "b2945435-3a39-4432-8eb1-be6333599f05",
  //     "timeBeforeDeparture": 0,
  //     "refundPercentage": "0.00",
  //     "feeAmount": "0.00"
  //   }
  // ]
  // calculate time and percentage refund to show it

  //function to get color based on percentage
  const getColor = (percentage: number) => {
    if (percentage === 100) return "green";
    if (percentage >= 50 && percentage < 100) return "yellow";
    return "red";
  };
  return (
    <div className="space-y-6 text-primary">
      {/* Chính sách hủy */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg mb-4">
          Chính sách hủy do nhà xe quy định
        </h2>
        <div className="border rounded-xl overflow-hidden border-gray-300">
          <div className="flex justify-between items-center px-4 py-3 text-gray-400">
            <div className="flex items-center gap-2 font-semibold">
              Thời gian hủy
            </div>
            <div className="font-semibold">Phí hủy</div>
          </div>
          {cancellationRules &&
            cancellationRules.length > 0 &&
            cancellationRules.map((rule) => (
              <div className="flex justify-between items-center px-4 py-3">
                <div className={`flex items-center gap-2 text-${getColor(Number(rule.refundPercentage))}-600 font-semibold`}>
                  <span className={`w-2 h-2 rounded-full bg-${getColor(Number(rule.refundPercentage))}-500 inline-block`} />
                  Trước giờ đi {rule.timeBeforeDeparture} giờ
                </div>
                <div className={`text-${getColor(Number(rule.refundPercentage))}-600 font-semibold`}>
                  {Number(rule.refundPercentage)}% hoàn tiền
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
          Vé áp dụng giá khuyến mãi không được phép hủy, hoàn tiền.
        </div>
      </div>

      {/* Các quy định khác */}
      <div className="text-base">
        <h2 className="font-bold text-lg mb-3">Các quy định khác</h2>

        {/* Yêu cầu khi lên xe */}
        {companyPolicies &&
          companyPolicies.length > 0 &&
          companyPolicies.map((policy) => (
            <div className="space-y-2 border-b border-gray-200 pb-4">
              <h3 className="font-semibold">{policy.title}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {policy.content.split("\n").map((line, index) => {
                  line = line.replaceAll("*", "");
                  return <div key={index}>{line}</div>;
                })}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
