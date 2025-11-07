export function convertMoney(amount: number): string {
  // 2000000  -> 2.000.000đ
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

export function formatDate(dateString: Date | string): string {
  // Date object or ISO string to dd/mm/yyyy
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(dateString: Date | string): string {
  // Date object or ISO string to HH:MM
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatNumberPhone(numberPhone: string | null): string {
  // 0987654321 -> 0987 654 321
  if (!numberPhone) return "N/A";
  return numberPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function findDuration(departureTime: Date | string, arrivalTime: Date | string): string {
  try {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
      throw new Error("Invalid date input");
    }

    const diffMs = arrival.getTime() - departure.getTime();
    if (diffMs < 0) return "Thời gian không hợp lệ";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} phút`;
    if (minutes === 0) return `${hours} giờ`;
    return `${hours} giờ ${minutes} phút`;
  } catch {
    return "Không xác định";
  }
}
