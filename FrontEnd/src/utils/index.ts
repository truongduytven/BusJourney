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
