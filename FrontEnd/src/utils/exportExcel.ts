import * as XLSX from 'xlsx';
import type { Route } from '@/types/route';

export const exportRoutesToExcel = (routes: Route[], filename: string = 'danh-sach-tuyen-duong.xlsx') => {
  // Chuẩn bị dữ liệu cho Excel
  const data = routes.map((route, index) => ({
    'STT': index + 1,
    'Điểm đi': route.startLocation?.name || '-',
    'Điểm đến': route.endLocation?.name || '-',
    'Khoảng cách (km)': route.distanceKm || 0,
    'Trạng thái': route.status === 'Approved' ? 'Đã duyệt' : route.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt',
    'Ngày tạo': route.createdAt ? new Date(route.createdAt).toLocaleDateString('vi-VN') : '-',
  }));

  // Tạo workbook và worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Tự động điều chỉnh độ rộng cột
  const colWidths = [
    { wch: 5 },   // STT
    { wch: 30 },  // Điểm đi
    { wch: 30 },  // Điểm đến
    { wch: 15 },  // Khoảng cách
    { wch: 15 },  // Trạng thái
    { wch: 15 },  // Ngày tạo
  ];
  ws['!cols'] = colWidths;

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Tuyến đường');

  // Xuất file
  XLSX.writeFile(wb, filename);
};
