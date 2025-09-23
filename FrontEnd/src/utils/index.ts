export function convertMoney(amount: number): string {
  // 2000000  -> 2.000.000đ
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
