import type { Knex } from 'knex';
import { config as dotenvConfig } from "dotenv";
import { knexSnakeCaseMappers } from "objection";
import path from 'path';

dotenvConfig({ path: path.resolve(__dirname, "../.env") });

const knexConfig: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'database',
        },
        migrations: {
            extension: 'ts',
            directory: '../migrations',
        },
        seeds: {
            extension: 'ts',
            directory: '../seeds'
        },
        ...knexSnakeCaseMappers()
    }
};

export default knexConfig;