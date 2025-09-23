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
  await knex("bus_companies").del();
  await knex("accounts").del();
  await knex("roles").del();
  await knex("coupons").del();

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
