import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Xóa dữ liệu cũ
  await knex("reviews").del();
  await knex("transactions").del();
  await knex("tickets").del();
  await knex("orders").del();
  await knex("points").del();
  await knex("trips").del();
  await knex("templates").del();
  await knex("routes").del();
  await knex("buses").del();
  await knex("seats").del();
  await knex("type_buses").del();
  await knex("locations").del();
  await knex("cities").del();
  await knex("coupons").del();
  await knex("cancellation_rules").del();
  await knex("company_policies").del();
  await knex("bus_companies").del();
  await knex("accounts").del();
  await knex("roles").del();

  // Roles
  const roles = await knex("roles").insert([
    { name: "admin" },
    { name: "company" },
    { name: "customer" },
  ]).returning("*");

  // Accounts
  const accounts = await knex("accounts").insert([
    { name: "Admin", email: "admin@example.com", password: "hashedpwd", role_id: roles[0].id },
    { name: "CompanyUser", email: "company@example.com", password: "hashedpwd", role_id: roles[1].id },
    { name: "Customer", email: "customer@example.com", password: "hashedpwd", role_id: roles[2].id },
  ]).returning("*");

  // Bus Companies
  const companies = await knex("bus_companies").insert([
    { name: "Mai Linh", address: "Hà Nội", phone: "0123456789" },
    { name: "Phương Trang", address: "Hồ Chí Minh", phone: "0987654321" },
  ]).returning("*");

  // Company Policies
  await knex("company_policies").insert([
    // Mai Linh - Chính sách hủy vé
    {
      company_id: companies[0].id,
      policy_type: "CANCELLATION",
      title: "Chính sách hủy do nhà xe quy định",
      content: `**Thời gian hủy - Phí hủy:**
• Trước 9:30 - 12/09/2025: Miễn phí
• 9:30 - 12/09/2025: 50%
• 12:30 - 12/09/2025: 100%

⚠️ **Lưu ý:** Vé áp dụng giá khuyến mãi không được phép hủy, hoàn tiền.`
    },
    {
      company_id: companies[0].id,
      policy_type: "GENERAL",
      title: "Các quy định khác",
      content: `**Yêu cầu khi lên xe:**
• Có mặt tại văn phòng/quầy vé/bến xe trước 30 phút để làm thủ tục lên xe
• Đối vé giấy trước khi lên xe
• Xuất trình SMS/Email đặt vé trước khi lên xe
• Không mang đồ ăn, thức ăn có mùi lên xe
• Không hút thuốc, uống rượu, sử dụng chất kích thích trên xe
• Không mang các vật dễ cháy nổ lên xe
• Không vứt rác trên xe
• Không làm ồn, gây mất trật tự trên xe
• Không mang giày, dép trên xe
• Không mang giày, dép trên xe`
    },
    {
      company_id: companies[0].id,
      policy_type: "BAGGAGE",
      title: "Hành lý xách tay",
      content: `• Tổng trọng lượng hành lý không vượt quá 20 kg
• Không vận chuyển hàng hóa công kênh
• Không hoàn tiền trong trường hợp hủy đơn hàng do vi phạm các quy định về hành lý`
    },
    {
      company_id: companies[0].id,
      policy_type: "CHILD_PREGNANT",
      title: "Trẻ em và phụ nữ có thai",
      content: `• Phụ nữ có thai cần đảm bảo sức khỏe trong suốt quá trình di chuyển
• Nhà xe có quyền từ chối phục vụ nếu hành khách không tuân thủ quy định an toàn`
    },
    
    // Phương Trang - Similar policies with slight variations
    {
      company_id: companies[1].id,
      policy_type: "CANCELLATION",
      title: "Chính sách hủy do nhà xe quy định",
      content: `**Thời gian hủy - Phí hủy:**
• Trước 8:00 - 12/09/2025: Miễn phí
• 8:00 - 12/09/2025: 30%
• 10:30 - 12/09/2025: 70%
• 12:00 - 12/09/2025: 100%

⚠️ **Lưu ý:** Vé áp dụng giá khuyến mãi không được phép hủy, hoàn tiền.`
    },
    {
      company_id: companies[1].id,
      policy_type: "GENERAL",
      title: "Các quy định khác",
      content: `**Yêu cầu khi lên xe:**
• Có mặt tại văn phòng/quầy vé/bến xe trước 15 phút để làm thủ tục lên xe
• Đối vé giấy trước khi lên xe
• Xuất trình SMS/Email đặt vé trước khi lên xe
• Không mang đồ ăn, thức ăn có mùi lên xe
• Không hút thuốc, uống rượu, sử dụng chất kích thích trên xe
• Không mang các vật dễ cháy nổ lên xe
• Không vứt rác trên xe
• Không làm ồn, gây mất trật tự trên xe
• Không mang giày, dép trên xe`
    },
    {
      company_id: companies[1].id,
      policy_type: "BAGGAGE",
      title: "Hành lý xách tay",
      content: `• Tổng trọng lượng hành lý không vượt quá 25 kg
• Không vận chuyển hàng hóa công kênh
• Miễn phí hành lý dưới 15 kg
• Không hoàn tiền trong trường hợp hủy đơn hàng do vi phạm các quy định về hành lý`
    },
    {
      company_id: companies[1].id,
      policy_type: "CHILD_PREGNANT",
      title: "Trẻ em và phụ nữ có thai",
      content: `• Phụ nữ có thai cần đảm bảo sức khỏe trong suốt quá trình di chuyển
• Trẻ em dưới 6 tuổi cần có người lớn đi cùng
• Nhà xe có quyền từ chối phục vụ nếu hành khách không tuân thủ quy định an toàn`
    }
  ]);

  // Cancellation Rules (structured data for Mai Linh)
  await knex("cancellation_rules").insert([
    {
      company_id: companies[0].id,
      time_before_departure: 72, // More than 72 hours
      refund_percentage: 100,
      fee_amount: 0
    },
    {
      company_id: companies[0].id,
      time_before_departure: 24, // 24-72 hours
      refund_percentage: 50,
      fee_amount: 0
    },
    {
      company_id: companies[0].id,
      time_before_departure: 0, // Less than 24 hours
      refund_percentage: 0,
      fee_amount: 0
    },
    // Phương Trang rules
    {
      company_id: companies[1].id,
      time_before_departure: 48, // More than 48 hours
      refund_percentage: 100,
      fee_amount: 0
    },
    {
      company_id: companies[1].id,
      time_before_departure: 24, // 24-48 hours
      refund_percentage: 70,
      fee_amount: 0
    },
    {
      company_id: companies[1].id,
      time_before_departure: 6, // 6-24 hours
      refund_percentage: 30,
      fee_amount: 0
    },
    {
      company_id: companies[1].id,
      time_before_departure: 0, // Less than 6 hours
      refund_percentage: 0,
      fee_amount: 0
    }
  ]);

  // Cities
  const cities = await knex("cities").insert([
    { name: "Hà Nội" },
    { name: "Hồ Chí Minh" },
    { name: "Đà Nẵng" },
  ]).returning("*");

  // Locations
  const locations = await knex("locations").insert([
    { name: "BX Mỹ Đình", city_id: cities[0].id },
    { name: "BX Giáp Bát", city_id: cities[0].id },
    { name: "BX Miền Đông", city_id: cities[1].id },
    { name: "BX Miền Tây", city_id: cities[1].id },
  ]).returning("*");

  // TypeBuses
  const typesBus = await knex("type_buses").insert([
    { name: "Ghế ngồi 16 chỗ", total_seats: 16, number_rows: 4, number_cols: 4, is_floors: false },
    { name: "Giường nằm 40 chỗ", total_seats: 40, number_rows: 10, number_cols: 4, is_floors: true, number_rows_floor: 5, number_cols_floor: 4 },
  ]).returning("*");

  // Seats
  const seats = [];
  for (let i = 1; i <= 16; i++) {
    seats.push({ code: `A${i}`, index_row: Math.ceil(i / 4), index_col: (i - 1) % 4, floor: 1, type_bus_id: typesBus[0].id });
  }
  await knex("Seats").insert(seats);

  // Buses
  const buses = await knex("buses").insert([
    { company_id: companies[0].id, license_plate: "30A-12345", type_bus_id: typesBus[0].id, images: JSON.stringify([]), extensions: JSON.stringify(["wifi"]) },
    { company_id: companies[1].id, license_plate: "51B-67890", type_bus_id: typesBus[1].id, images: JSON.stringify([]), extensions: JSON.stringify(["water", "tv"]) },
  ]).returning("*");

  // Routes
  const routes = await knex("routes").insert([
    { start_location_id: locations[0].id, end_location_id: locations[2].id, distance_km: 1700 },
    { start_location_id: locations[1].id, end_location_id: locations[3].id, distance_km: 1600 },
  ]).returning("*");

  // Templates
  const templates = await knex("templates").insert([
    { company_id: companies[0].id, route_id: routes[0].id, type_bus_id: typesBus[0].id, name: "HN → SG" },
    { company_id: companies[1].id, route_id: routes[1].id, type_bus_id: typesBus[1].id, name: "HN → SG VIP" },
  ]).returning("*");

  // Trips
  const trips = await knex("trips").insert([
    { route_id: routes[0].id, template_id: templates[0].id, bus_id: buses[0].id, departure_time: new Date(), arrival_time: new Date(Date.now() + 1000 * 60 * 60 * 24), price: 500000, status: "scheduled" },
    { route_id: routes[1].id, template_id: templates[1].id, bus_id: buses[1].id, departure_time: new Date(), arrival_time: new Date(Date.now() + 1000 * 60 * 60 * 24), price: 800000, status: "scheduled" },
  ]).returning("*");

  // Points
  const points = await knex("points").insert([
    { trip_id: trips[0].id, type: "pickup", time: new Date(), locationName: "BX Mỹ Đình" },
    { trip_id: trips[0].id, type: "dropoff", time: new Date(Date.now() + 1000 * 60 * 60 * 24), locationName: "BX Miền Đông" },
  ]).returning("*");

  // Coupons
  const coupons = await knex("coupons").insert([
    { description: "Giảm 10%", discount_type: "percent", discount_value: 10, max_discount_value: 100000, max_uses: 100, valid_from: new Date(), valid_to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), status: "active", company_id: companies[0].id, create_by: "admin" },
  ]).returning("*");

  // Orders
  const orders = await knex("orders").insert([
    { coupon_id: coupons[0].id, user_id: accounts[2].id, origin_amount: 500000, final_amount: 450000, status: "paid" },
  ]).returning("*");

  // Tickets
  const tickets = await knex("tickets").insert([
    { ticket_code: "TCK001", order_id: orders[0].id, user_id: accounts[2].id, trip_id: trips[0].id, seat_code: "A1", qr_code: "QRDATA", status: "valid", pickup_point_id: points[0].id, dropoff_point_id: points[1].id },
  ]).returning("*");

  // Transactions
  await knex("transactions").insert([
    { order_id: orders[0].id, amount: 450000, payment_method: "momo", status: "success" },
  ]);

  // Reviews
  await knex("reviews").insert([
    { trip_id: trips[0].id, rating: 5, commenttext: "Xe chạy êm, thoải mái!", create_by: accounts[2].id },
    { trip_id: trips[1].id, rating: 4, commenttext: "Dịch vụ tốt nhưng hơi trễ giờ", create_by: accounts[2].id },
  ]);
}
