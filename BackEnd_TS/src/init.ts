import { Model } from 'objection';
import knex from './db';

// Import tất cả models để đăng ký với Objection.js
import './models/Accounts';
import './models/Bus';
import './models/BusCompany';
import './models/City';
import './models/Coupon';
import './models/Location';
import './models/Order';
import './models/Point';
import './models/Reviews';
import './models/Role';
import './models/Route';
import './models/Seat';
import './models/Template';
import './models/Ticket';
import './models/Transaction';
import './models/Trip';
import './models/TypeBus';

// Khởi tạo database connection
export const initializeDatabase = async () => {
  try {
    await knex.raw('SELECT 1');
    Model.knex(knex);
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default initializeDatabase;