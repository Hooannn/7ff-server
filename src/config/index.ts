import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, ORIGIN, PORT, MYSQL_HOST, MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT, LOG_FORMAT, LOG_DIR } = process.env;
